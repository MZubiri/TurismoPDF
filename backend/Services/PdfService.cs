using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using QRCoder;
using System.IO;
using TurismoPDF.Backend.Models;

namespace TurismoPDF.Backend.Services
{
    public class PdfService
    {
        private readonly IWebHostEnvironment _env;

        public PdfService(IWebHostEnvironment env)
        {
            _env = env;
        }

        public string GenerateVoucherPdf(Reservation reservation, PdfSettings settings, string language, string folderPath)
        {
            var isEs = language.ToLower() == "es";

            var title = isEs ? "VOUCHER DE RESERVA" : "BOOKING VOUCHER";
            var folio = $"GT-{reservation.CreatedAt.Year}-{reservation.Id.ToString("D5")}";

            // Labels
            var lblName = isEs ? "Nombre / Name:" : "Name:";
            var lblHotel = "Hotel:";
            var lblDestination = isEs ? "Destino / Destination:" : "Destination:";
            var lblTour = isEs ? "Servicio / Service:" : "Service:";
            var lblDate = isEs ? "Día del Tour / Day of Tour:" : "Day of Tour:";
            var lblPhone = isEs ? "Teléfono / Phone:" : "Phone:";
            var lblNotes = isEs ? "Notas y Observaciones:" : "Notes & Remarks:";

            // Values
            var fullName = $"{reservation.FirstName} {reservation.LastName}".ToUpper();
            var destName = reservation.Destination?.Name?.ToUpper() ?? "-";
            var tourName = reservation.Activity?.Name?.ToUpper() ?? "-";
            var dateStr = reservation.ReservationDate.ToString("dd 'DE' MMMM 'DEL' yyyy").ToUpper();
            if (!isEs)
                dateStr = reservation.ReservationDate.ToString("MMMM dd, yyyy").ToUpper();

            // Disclaimers
            var disclaimerEs = "EL DINERO NO SERÁ REEMBOLSABLE SI EL PASAJERO PIERDE LA EXCURSIÓN POR NO ESTAR A LA HORA INDICADA, AL IGUAL QUE LAS EXCURSIONES NO TOMADAS. RESERVAS.TOURSGOTRAVEL.COM ACTÚA COMO INTERMEDIARIO ENTRE EL PASAJERO Y EL PRESTADOR DE SERVICIOS, POR LO QUE NOS DESLINDAMOS DE RESPONSABILIDADES INHERENTES A DEMORAS O IMPREVISTOS. PARA CUALQUIER ACLARACIÓN FAVOR DE COMUNICARSE AL:";
            var disclaimerEn = "MONEY WILL NOT BE REFUNDABLE IF THE PASSENGER MISSES THE EXCURSION FOR NOT BEING AT THE INDICATED TIME, AS WELL AS FOR EXCURSIONS NOT TAKEN. RESERVAS.TOURSGOTRAVEL.COM ACTS AS AN INTERMEDIARY BETWEEN PASSENGER AND SERVICE PROVIDER, DISCLAIMING LIABILITY FOR DELAYS OR UNFORESEEN EVENTS. FOR CLARIFICATION CONTACT:";

            // Brand colors: Azul (#0F4C81) & Azul Verde (#00A896)
            var brandBlue = "#0F4C81";
            var brandBlueGreen = "#00A896";
            var brandText = "#1E293B";
            var borderColor = "#CBD5E1";
            var tableHeaderBg = "#0F4C81";
            var tableTotalBg = "#E6F7F5";
            var cardBg = "#FFFFFF";

            // Enlarged Font Sizes across the entire document
            const float titleFontSize = 16.5f;     // Title & Folio (PROMINENT & LARGE)
            const float headerFontSize = 11.5f;   // Subheaders & Table Headers
            const float bodyFontSize = 10.5f;     // Main Info, Values, Labels & Tables (LARGE & LEGIBLE)
            const float disclaimerFontSize = 8.5f; // Disclaimers & Legal Terms (LARGE)

            // Load images
            var logoPath = Path.Combine(_env.WebRootPath, "images", "logo.jpg");
            var subtleBgPath = Path.Combine(_env.WebRootPath, "images", "subtle_beach_bg.png");
            byte[]? logoBytes = File.Exists(logoPath) ? File.ReadAllBytes(logoPath) : null;
            byte[]? subtleBgBytes = File.Exists(subtleBgPath) ? File.ReadAllBytes(subtleBgPath) : null;

            // Generate QR Code
            byte[] qrImageBytes;
            using (var qrGenerator = new QRCodeGenerator())
            {
                var qrCodeData = qrGenerator.CreateQrCode("https://reservas.toursgotravel.com", QRCodeGenerator.ECCLevel.M);
                using (var qrCode = new PngByteQRCode(qrCodeData))
                {
                    qrImageBytes = qrCode.GetGraphic(8);
                }
            }

            var document = Document.Create(container =>
            {
                container.Page(page =>
                {
                    page.Size(PageSizes.A4);
                    page.Margin(0);
                    page.DefaultTextStyle(x => x.FontSize(bodyFontSize).FontColor(brandText));

                    // ── BACKGROUND: Faint Caribbean Beach Drawing filling entire sheet ──
                    if (subtleBgBytes != null)
                    {
                        page.Background().Image(subtleBgBytes).FitArea();
                    }
                    else
                    {
                        page.PageColor("#F4F9FA");
                    }

                    // ── HEADER ──
                    page.Header().Column(headerCol =>
                    {
                        headerCol.Item().Background(cardBg).PaddingHorizontal(28).PaddingVertical(12).Row(row =>
                        {
                            // Logo & Branding
                            row.RelativeItem().AlignMiddle().Row(logoRow =>
                            {
                                if (logoBytes != null)
                                {
                                    logoRow.ConstantItem(48).Height(48).Image(logoBytes);
                                    logoRow.ConstantItem(12);
                                }
                                logoRow.RelativeItem().Column(col =>
                                {
                                    col.Item().Text("ToursGoTravel.com").FontSize(titleFontSize).Bold().FontColor(brandBlue);
                                    col.Item().Text("Los mejores tours a los mejores precios").FontSize(headerFontSize).SemiBold().FontColor(brandBlueGreen);
                                });
                            });

                            // Folio & Title
                            row.ConstantItem(210).AlignRight().AlignMiddle().Column(col =>
                            {
                                col.Item().Text(title).FontSize(headerFontSize).Bold().FontColor(brandBlueGreen).AlignRight();
                                col.Item().Text(folio).FontSize(titleFontSize).Bold().FontColor(brandBlue).AlignRight();
                            });
                        });

                        // Accent line (Blue-Green)
                        headerCol.Item().Height(4.5f).Background(brandBlueGreen);
                    });

                    // ── CONTENT (Large Text & Prominent Elements) ──
                    page.Content().PaddingHorizontal(28).PaddingTop(16).PaddingBottom(16).Column(mainCol =>
                    {
                        // === Guest Info Section (Large 10.5pt font, bold labels) ===
                        mainCol.Item().PaddingBottom(14).Background(cardBg).Border(1.2f).BorderColor(brandBlueGreen).Padding(10).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.ConstantColumn(175);
                                columns.RelativeColumn();
                            });

                            void AddInfoRow(string label, string value, bool isHighlight = false)
                            {
                                table.Cell().PaddingVertical(4f).PaddingHorizontal(8)
                                    .Text(label).Bold().FontSize(bodyFontSize).FontColor(brandBlue);
                                table.Cell().PaddingVertical(4f).PaddingHorizontal(8)
                                    .Text(value).FontSize(bodyFontSize).Bold().FontColor(isHighlight ? brandBlueGreen : brandText);
                            }

                            AddInfoRow(lblName, fullName, true);
                            AddInfoRow(lblDestination, destName);
                            AddInfoRow(lblHotel, reservation.Hotel?.ToUpper() ?? "-");
                            AddInfoRow(lblPhone, reservation.Phone ?? "-");
                            AddInfoRow(lblTour, tourName);
                            AddInfoRow(lblDate, dateStr);
                        });

                        // === Notes Box (Large font) ===
                        if (!string.IsNullOrWhiteSpace(reservation.Notes))
                        {
                            mainCol.Item().PaddingBottom(14).Background(cardBg).Border(1.2f).BorderColor(brandBlueGreen).Padding(9).Column(noteCol =>
                            {
                                noteCol.Item().Text(lblNotes).Bold().FontSize(headerFontSize).FontColor(brandBlue);
                                noteCol.Item().PaddingTop(3).Text(reservation.Notes).FontSize(bodyFontSize).FontColor(brandText);
                            });
                        }

                        // === Passenger Breakdown Table (Large Header & Body Fonts) ===
                        mainCol.Item().PaddingBottom(16).Table(table =>
                        {
                            table.ColumnsDefinition(columns =>
                            {
                                columns.RelativeColumn(1.8f);
                                columns.RelativeColumn();
                                columns.RelativeColumn(1.2f);
                                columns.RelativeColumn(1.2f);
                            });

                            // Header
                            table.Cell().Background(tableHeaderBg).Padding(6)
                                .Text(isEs ? "CONCEPTO" : "CONCEPT").FontSize(headerFontSize).Bold().FontColor(Colors.White).AlignCenter();
                            table.Cell().Background(tableHeaderBg).Padding(6)
                                .Text("PAX").FontSize(headerFontSize).Bold().FontColor(Colors.White).AlignCenter();
                            table.Cell().Background(tableHeaderBg).Padding(6)
                                .Text(isEs ? "PRECIO P/P" : "PRICE P/P").FontSize(headerFontSize).Bold().FontColor(Colors.White).AlignCenter();
                            table.Cell().Background(tableHeaderBg).Padding(6)
                                .Text(isEs ? "IMPORTE" : "AMOUNT").FontSize(headerFontSize).Bold().FontColor(Colors.White).AlignCenter();

                            // Adult row
                            table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text(isEs ? "ADULTO:" : "ADULT:").Bold().FontSize(bodyFontSize).FontColor(brandBlue);
                            table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text(reservation.Adults.ToString()).FontSize(bodyFontSize).Bold().AlignCenter();
                            table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text(isEs ? "PAGADO" : "PAID").FontSize(bodyFontSize).Bold().FontColor(brandBlueGreen).AlignCenter();
                            table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text(isEs ? "PAGADO" : "PAID").FontSize(bodyFontSize).Bold().FontColor(brandBlueGreen).AlignCenter();

                            // Children row
                            if (reservation.Children > 0)
                            {
                                table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                    .Text(isEs ? "MENOR:" : "CHILD:").Bold().FontSize(bodyFontSize).FontColor(brandBlue);
                                table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                    .Text(reservation.Children.ToString()).FontSize(bodyFontSize).Bold().AlignCenter();
                                table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                    .Text(isEs ? "PAGADO" : "PAID").FontSize(bodyFontSize).Bold().FontColor(brandBlueGreen).AlignCenter();
                                table.Cell().Background(cardBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                    .Text(isEs ? "PAGADO" : "PAID").FontSize(bodyFontSize).Bold().FontColor(brandBlueGreen).AlignCenter();
                            }

                            // Total row
                            table.Cell().Background(tableTotalBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text("TOTAL").Bold().FontSize(bodyFontSize).FontColor(brandBlue);
                            table.Cell().Background(tableTotalBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text((reservation.Adults + reservation.Children).ToString()).FontSize(bodyFontSize).Bold().AlignCenter();
                            table.Cell().Background(tableTotalBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text(isEs ? "TOTAL" : "TOTAL").FontSize(bodyFontSize).Bold().FontColor(brandBlue).AlignCenter();
                            table.Cell().Background(tableTotalBg).Border(0.5f).BorderColor(borderColor).Padding(5f)
                                .Text(isEs ? "PAGADO" : "PAID").FontSize(bodyFontSize).Bold().FontColor(brandBlueGreen).AlignCenter();
                        });

                        // === PROMINENT & LARGE DISCLAIMERS & QR CODE SECTION ===
                        mainCol.Item().Row(row =>
                        {
                            // QR Column
                            row.ConstantItem(105).Column(qrCol =>
                            {
                                qrCol.Item().Width(100).Height(100).Background(cardBg).Border(1.5f).BorderColor(brandBlueGreen).Padding(4)
                                    .Image(qrImageBytes);
                                qrCol.Item().PaddingTop(4).AlignCenter()
                                    .Text("ToursGoTravel.com").FontSize(headerFontSize).Bold().FontColor(brandBlue);
                                qrCol.Item().PaddingTop(2).AlignCenter()
                                    .Text(isEs ? "PASE DE ABORDAR" : "BOARDING PASS").FontSize(disclaimerFontSize).Bold().FontColor(brandBlueGreen);
                            });

                            row.ConstantItem(12); // spacer

                            // Disclaimer Boxes Column (Large font size 8.5pt)
                            row.RelativeItem().Column(discCol =>
                            {
                                discCol.Item().Row(discRow =>
                                {
                                    // Spanish Terms Box
                                    discRow.RelativeItem().Background(cardBg).Border(1.2f).BorderColor(brandBlueGreen).Padding(8).Column(c =>
                                    {
                                        c.Item().Text(disclaimerEs).FontSize(disclaimerFontSize).FontColor(brandText).LineHeight(1.2f);
                                        c.Item().PaddingTop(4).Text($"CONTACTO: {settings.PhoneNumber}").FontSize(disclaimerFontSize).Bold().FontColor(brandBlue);
                                    });

                                    discRow.ConstantItem(8); // spacer between disclaimer boxes

                                    // English Terms Box
                                    discRow.RelativeItem().Background(cardBg).Border(1.2f).BorderColor(brandBlueGreen).Padding(8).Column(c =>
                                    {
                                        c.Item().Text(disclaimerEn).FontSize(disclaimerFontSize).FontColor(brandText).LineHeight(1.2f);
                                        c.Item().PaddingTop(4).Text($"EMAIL: {settings.Email}").FontSize(disclaimerFontSize).Bold().FontColor(brandBlue);
                                    });
                                });
                            });
                        });
                    });
                });
            });

            var fileName = $"Voucher_{folio}_{language}.pdf";
            var filePath = Path.Combine(folderPath, fileName);
            document.GeneratePdf(filePath);

            return fileName;
        }
    }
}

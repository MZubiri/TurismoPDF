FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["TurismoPDF.Backend.csproj", "./"]
RUN dotnet restore "TurismoPDF.Backend.csproj"

COPY . .
RUN dotnet publish "TurismoPDF.Backend.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

RUN mkdir -p /app/pdfs /app/data

ENV ASPNETCORE_URLS=http://+:5020
EXPOSE 5020

ENTRYPOINT ["dotnet", "TurismoPDF.Backend.dll"]

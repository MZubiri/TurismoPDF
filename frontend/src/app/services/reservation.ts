import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReservationService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/reservations';

  getAll() { return this.http.get<any[]>(this.apiUrl); }
  getById(id: number) { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }

  downloadPdf(id: number, lang: string) {
    const url = `${this.apiUrl}/${id}/pdf?lang=${lang}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  generatePdf(id: number, lang: string) {
    return this.http.post(`${this.apiUrl}/${id}/pdf?lang=${lang}`, {});
  }
}
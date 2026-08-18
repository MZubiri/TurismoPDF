import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/activities';

  getAll() { return this.http.get<any[]>(this.apiUrl); }
  getByDestination(destId: number) { return this.http.get<any[]>(`${this.apiUrl}?destinationId=${destId}`); }
  getById(id: number) { return this.http.get<any>(`${this.apiUrl}/${id}`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  update(id: number, data: any) { return this.http.put(`${this.apiUrl}/${id}`, data); }
  delete(id: number) { return this.http.delete(`${this.apiUrl}/${id}`); }
}
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PdfSettingsService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/pdfsettings';

  get() { return this.http.get<any>(this.apiUrl); }
  update(data: any) { return this.http.put(this.apiUrl, data); }
}
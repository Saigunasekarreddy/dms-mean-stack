import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DocumentItem } from '../models/app.models';

interface DocumentsResponse {
  success: boolean;
  count: number;
  documents: DocumentItem[];
}

interface DocumentResponse {
  success: boolean;
  message?: string;
  document: DocumentItem;
}

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly apiUrl = '/api/docs';

  constructor(private readonly http: HttpClient) {}

  uploadDocument(file: File, tags: string): Observable<DocumentResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('tags', tags);
    return this.http.post<DocumentResponse>(`${this.apiUrl}/upload`, formData);
  }

  getDocuments(): Observable<DocumentsResponse> {
    return this.http.get<DocumentsResponse>(this.apiUrl);
  }

  getDocumentById(id: string): Observable<DocumentResponse> {
    return this.http.get<DocumentResponse>(`${this.apiUrl}/${id}`);
  }

  searchDocuments(query: string, tags = ''): Observable<DocumentsResponse> {
    let params = new HttpParams();
    if (query) params = params.set('q', query);
    if (tags) params = params.set('tags', tags);
    return this.http.get<DocumentsResponse>(`${this.apiUrl}/search`, { params });
  }

  updateDocument(id: string, payload: { file?: File | null; tags?: string }): Observable<DocumentResponse> {
    const formData = new FormData();
    if (payload.file) {
      formData.append('file', payload.file);
    }
    if (payload.tags !== undefined) {
      formData.append('tags', payload.tags);
    }
    return this.http.put<DocumentResponse>(`${this.apiUrl}/${id}`, formData);
  }

  deleteDocument(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}

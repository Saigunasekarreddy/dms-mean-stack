import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DocumentItem } from '../../core/models/app.models';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './document-list.component.html',
  styleUrl: './document-list.component.css',
})
export class DocumentListComponent implements OnInit {
  loading = true;
  error = '';
  documents: DocumentItem[] = [];
  query = '';

  constructor(private readonly documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.documentService.getDocuments().subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load documents';
        this.loading = false;
      },
    });
  }

  search(): void {
    this.loading = true;
    this.documentService.searchDocuments(this.query).subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Search failed';
        this.loading = false;
      },
    });
  }

  remove(id: string): void {
    if (!confirm('Delete this document?')) return;
    this.documentService.deleteDocument(id).subscribe({
      next: () => this.loadDocuments(),
      error: (err) => {
        this.error = err?.error?.message || 'Delete failed';
      },
    });
  }
}

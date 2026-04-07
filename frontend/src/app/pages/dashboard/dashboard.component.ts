import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DocumentItem } from '../../core/models/app.models';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  loading = true;
  error = '';
  documents: DocumentItem[] = [];

  constructor(private readonly documentService: DocumentService) {}

  ngOnInit(): void {
    this.documentService.getDocuments().subscribe({
      next: (response) => {
        this.documents = response.documents;
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load dashboard';
        this.loading = false;
      },
    });
  }
}

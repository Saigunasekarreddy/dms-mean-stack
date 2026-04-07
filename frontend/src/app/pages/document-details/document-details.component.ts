import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentItem } from '../../core/models/app.models';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-document-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './document-details.component.html',
  styleUrl: './document-details.component.css',
})
export class DocumentDetailsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  loading = true;
  saving = false;
  error = '';
  success = '';
  document: DocumentItem | null = null;
  selectedFile: File | null = null;

  readonly form = this.fb.group({
    tags: [''],
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.fetchDocument();
  }

  fetchDocument(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Invalid document id';
      this.loading = false;
      return;
    }

    this.loading = true;
    this.documentService.getDocumentById(id).subscribe({
      next: (response) => {
        this.document = response.document;
        this.form.patchValue({
          tags: response.document.tags?.join(', ') || '',
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Failed to load document';
        this.loading = false;
      },
    });
  }

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.selectedFile = target.files?.[0] ?? null;
  }

  saveChanges(): void {
    if (!this.document) return;
    this.saving = true;
    this.error = '';
    this.success = '';

    this.documentService
      .updateDocument(this.document._id, {
        file: this.selectedFile,
        tags: this.form.value.tags || '',
      })
      .subscribe({
        next: () => {
          this.saving = false;
          this.success = 'Document updated successfully';
          this.selectedFile = null;
          this.fetchDocument();
        },
        error: (err) => {
          this.saving = false;
          this.error = err?.error?.message || 'Update failed';
        },
      });
  }
}

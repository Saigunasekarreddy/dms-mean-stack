import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DocumentService } from '../../core/services/document.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css',
})
export class UploadComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = '';
  success = '';
  selectedFile: File | null = null;

  readonly form = this.fb.group({
    tags: [''],
    file: [null as File | null, Validators.required],
  });

  constructor(
    private readonly documentService: DocumentService
  ) {}

  onFileChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0] ?? null;
    this.selectedFile = file;
    this.form.patchValue({ file });
  }

  submit(): void {
    if (!this.selectedFile) {
      this.error = 'Please choose a file';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    const tags = this.form.value.tags || '';
    this.documentService.uploadDocument(this.selectedFile, tags).subscribe({
      next: () => {
        this.loading = false;
        this.success = 'Document uploaded successfully';
        this.form.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Upload failed';
      },
    });
  }
}

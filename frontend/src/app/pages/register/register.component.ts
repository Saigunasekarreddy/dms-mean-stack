import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);

  loading = false;
  error = '';
  success = '';

  readonly form = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService
      .register(this.form.getRawValue() as { name: string; email: string; password: string })
      .subscribe({
        next: () => {
          this.loading = false;
          this.success = 'Account created successfully. Redirecting...';
          setTimeout(() => this.router.navigate(['/dashboard']), 400);
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Registration failed';
        },
      });
  }
}

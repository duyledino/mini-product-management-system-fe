import { Component, inject, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthStore } from '../../core/state/auth-store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private router = inject(Router);
  private authStore = inject(AuthStore);
  loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if(this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.toastr.error('Please fill in all the fields', 'Error');
      return;
    }
    this.authStore.login(this.loginForm.value).subscribe({
      next: (response) => {
      this.toastr.success(response.message || 'Login successful');
      this.router.navigate(['/']); // Component handles navigation
    },
    error: (error) => {
      const errorMsg = error.error?.error || 'Login failed';
      this.toastr.error(errorMsg);
    }
    });
  }
}

import { Component, inject } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthStore } from '../../core/state/auth-store';
import { Router } from '@angular/router';

export const passwordMatchValidator = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  // If they don't match, return an error object, otherwise return null
  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule],
  standalone: true,
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})

export class RegisterForm {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private authStore = inject(AuthStore);
  private router = inject(Router);
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
  });

  onSubmit() {

    if(this.registerForm.invalid) {
      if(this.registerForm.value.confirmPassword !== this.registerForm.value.password) {
        this.toastr.error('Passwords do not match', 'Error');
        return;
      }
      this.registerForm.markAllAsTouched();
      this.toastr.error('Please fill in all the fields', 'Error');
      return;
    }
    this.authStore.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.router.navigate(['/product']);
        this.toastr.success(response.message || 'Register successful', 'Success');
      },
      error: (error) => {
        this.toastr.error(error.error.error || 'Register failed', 'Error');
      }
    });

  }
}

import { Component } from '@angular/core';
import { RegisterForm } from "../../components/register-form/register-form";

@Component({
  selector: 'app-register',
  imports: [RegisterForm],
  standalone: true,
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {}

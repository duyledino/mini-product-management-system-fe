import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '../../core/state/auth-store';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  standalone:true,
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  public userStore = inject(AuthStore);

}

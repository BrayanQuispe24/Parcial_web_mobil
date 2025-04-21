import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserApiService } from '../../services/userApi.service';

@Component({
  selector: 'app-register-page',
  imports: [
    RouterLink
  ],
  templateUrl: './register-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent {
  //vamos a crear los signals
  public gmail = signal<string>('');
  public name = signal<string>('');
  public password = signal<string>('');

  //inyecciones
  router = inject(Router);
  userService = inject(UserApiService);

  // implementar el registro
  public register(event: Event) {
    event.preventDefault();
    const user = {
      first_name: this.name(),
      email: this.gmail(),
      password: this.password()
    }
    this.userService.register(user);
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1500);
  }

}

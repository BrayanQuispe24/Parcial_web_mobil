import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { UserApiService } from '../../services/userApi.service';
import { DataAuth } from '../../models/usuario.interface';
//import { NotificacionesService } from '../../services/notificacionesService.service';
import { error } from 'console';
import { HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  imports: [
    RouterLink
  ],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  email = signal<string>('');
  password = signal<string>('');
  router = inject(Router);
  userService = inject(UserApiService);//aqui se realizo la inyeccion  del servicio, esto incluye los datos y las funciones

  toastr = inject(ToastrService);


  constructor() {
    //effect(() => {
    //  const token = this.userService.dataAuth().token;
    //  if (token.length > 0) {
    //    console.log('Token recibido, navegando...');
    //    this.router.navigate(['/dashboard']);
    //  }
    //});
  }



  public login(event: Event) {
    event.preventDefault();
    const user = {
      email: this.email(),
      password: this.password()
    }
    this.userService.login(user)
      .subscribe({
        next:
          (resp) => {
            const authData: DataAuth = {
              token: resp.token,
              role: resp.role
            };
            if (authData.token) {
              localStorage.setItem('token', resp.token);
              localStorage.setItem('role', resp.role);
              this.userService.dataAuth.set(authData);
              this.toastr.success("¡Bienvenido!", "Login exitoso")
              this.router.navigate(['/dashboard'])
            } else {
              this.toastr.error("Error, no se recibio el token")
            }
          },
        error: (e: HttpErrorResponse) => {
          const errorMessage = e.error?.detail ||
            e.error?.message ||
            "Error al iniciar sesion";

            this.toastr.error(errorMessage, 'Error', {
              positionClass: 'toast-bottom-right',
              timeOut:3000// Nota que se usa 'timeOut' en lugar de 'timeout'
            });
        }
      }
      );
  }
}

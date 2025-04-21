import { ChangeDetectionStrategy, Component, input, signal, inject } from '@angular/core';
import { UserFullDate } from '../../../models/usuario.interface';
import { ModalService } from '../../../services/modal.service';
import { UserApiService } from '../../../services/userApi.service';

@Component({
  selector: 'user-component',
  imports: [],
  templateUrl: './user-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponentComponent {
  modalUpdateUserService = inject(ModalService);
  userService = inject(UserApiService);
  modalAsignacionPermisos = inject(ModalService);

  user = input<UserFullDate>();



  public deleteUser() {
    this.userService.deleteUser(this.user()?.id);
  }

  public sendUserToFormUpdate() {
    this.modalUpdateUserService.showModalUpdateSwitch();
    this.userService.userUpdate.set(this.user());
  }
  public mostrarModalPermisos() {
    this.userService.usuarioActualizarPermiso.set(this.user());
    this.userService.obtenerPermisos(this.userService.usuarioActualizarPermiso().id);//aqui obtenemos los permisos
    setTimeout(() => {
      this.modalAsignacionPermisos.mostrarAsignacionPermisosSwitch();
    }, 200);

  }


}

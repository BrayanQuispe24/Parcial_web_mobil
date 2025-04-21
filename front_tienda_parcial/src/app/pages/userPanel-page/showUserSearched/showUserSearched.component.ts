import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { UserApiService } from '../../../services/userApi.service';

@Component({
  selector: 'show-user-searched',
  imports: [],
  templateUrl: './showUserSearched.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowUserSearchedComponent {
  mostarUsuarioService = inject(ModalService);
  modalUpdaTeService = inject(ModalService);
  modalPermisoService = inject(ModalService);
  userService = inject(UserApiService);
  private id=this.userService.userSearched()?.id;//aqui obtenemos el id recomendacion no abusar de las seniales
  public deleteUser() {
    this.userService.deleteUser(this.userService.userSearched()?.id);
  }

  public sendUserToFormUpdate() {
    this.modalUpdaTeService.showModalUpdateSwitch();
    this.userService.userUpdate.set(this.userService.userSearched());
  }
  public actualizarPermisos() {
    this.userService.obtenerPermisos(this.id);
    setTimeout(() => {
      this.modalPermisoService.mostrarAsignacionPermisosSwitch();
    }, 200);
  }

  public closeShowUser() {
    this.mostarUsuarioService.showModalSearchedUserSwitch();
    this.userService.userUpdate.set({
      id: 0,
      email: '',
      first_name: 'string',
      role: 'string',
      is_active: true,
    })
  }
}

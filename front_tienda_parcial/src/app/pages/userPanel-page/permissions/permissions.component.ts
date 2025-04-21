import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { UserApiService } from '../../../services/userApi.service';
import { Permisos } from '../../../models/permisos.interface';

@Component({
  selector: 'permissions',
  imports: [],
  templateUrl: './permissions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionsComponent {

  modalAsigancionPermisos = inject(ModalService);

  userService = inject(UserApiService);//de aqui obtendremos el id

  crear = signal<boolean>(this.userService.actualizarPermisosUser().crear);
  eliminar = signal<boolean>(this.userService.actualizarPermisosUser().eliminar);
  actualizar = signal<boolean>(this.userService.actualizarPermisosUser().actualizar);
  ver = signal<boolean>(this.userService.actualizarPermisosUser().ver);


  public cerrarPermisoModal() {
    this.modalAsigancionPermisos.mostrarAsignacionPermisosSwitch();
    this.userService.actualizarPermisosUser.set({
      crear: false,
      eliminar: false,
      actualizar: false,
      ver: false,
      usuario_id: 0
    })
    this.userService.usuarioActualizarPermiso.set({
      id: 0,
      email: '',
      first_name: '',
      role: '',
      is_active: ''
    });
  }

  public aplicarPermisos() {
    console.log(this.userService.usuarioActualizarPermiso());
    console.log(this.userService.actualizarPermisosUser());

    const newPermisos: Permisos = {
      crear: this.crear(),
      eliminar: this.eliminar(),
      actualizar: this.actualizar(),
      ver: this.ver(),
      usuario_id: this.userService.actualizarPermisosUser().usuario_id
    }
    this.userService.actualizarPermisos(newPermisos);
    this.userService.actualizarPermisosUser.set({
      crear: false,
      eliminar: false,
      actualizar: false,
      ver: false,
      usuario_id: 0
    })
    this.userService.usuarioActualizarPermiso.set({
      id: 0,
      email: '',
      first_name: '',
      role: '',
      is_active: ''
    });
    this.modalAsigancionPermisos.mostrarAsignacionPermisosSwitch();
  }
}
//actualizarPermisosUser

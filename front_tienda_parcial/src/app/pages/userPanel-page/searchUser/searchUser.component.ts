import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { UserApiService } from '../../../services/userApi.service';

@Component({
  selector: 'search-user',
  imports: [],
  templateUrl: './searchUser.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchUserComponent {
  modalService = inject(ModalService);
  userService = inject(UserApiService);

  email = signal<string>('');

  public BuscarUsuario() {
    this.userService.getUser(this.email());
    //this.userService.usuarioActualizarPermiso.set(this.userService.userSearched());

    setTimeout(() => {
      //this.modalService.showModalSearchedUserSwitch();
      console.log(this.userService.userSearched());
      this.modalService.mostrarUsuarioBuscadoSwitch();
    }, 500);

  }
}

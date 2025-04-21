import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { UserApiService } from '../../../services/userApi.service';
import { UserWithRole } from '../../../models/usuario.interface';
import { ModalService } from '../../../services/modal.service';


@Component({
  selector: 'app-create-user-component',
  imports: [],
  templateUrl: './createUser-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUserComponentComponent {
  userService = inject(UserApiService);
  modalCreateService=inject(ModalService);


  name = signal<string>('');
  email = signal<string>('');
  password = signal<string>('');
  role = signal<string>('');


  public createUser(event:Event) {
    event.preventDefault();
    const usuarioWithRole: UserWithRole = {
      first_name: this.name(),
      email: this.email(),
      password: this.password(),
      role: this.role().toUpperCase()
    }
    this.userService.registerWithRole(usuarioWithRole);
    this.modalCreateService.showModalCreateSwitch();
  }
}

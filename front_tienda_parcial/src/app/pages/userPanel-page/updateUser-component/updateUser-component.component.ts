import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { ModalService } from '../../../services/modal.service';
import { UserApiService } from '../../../services/userApi.service';

@Component({
  selector: 'update-user-component',
  imports: [],
  templateUrl: './updateUser-component.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateUserComponentComponent {

  modalUpdateUserService = inject(ModalService);
  userService = inject(UserApiService);
  private id=signal<number>(this.userService.userUpdate().id);
  email = signal<string>(this.userService.userUpdate().email);
  first_name = signal<string>(this.userService.userUpdate().first_name)
  role = signal<string>(this.userService.userUpdate().role)
  password = signal<string>('');


  public updateUser(event:Event) {
    event.preventDefault();
    this.userService.userUpdate.set({
      id: this.id(),
      email: this.email(),
      first_name: this.first_name(),
      role: this.role()
    });
    this.userService.updateUserOnlyAdmin(this.userService.userUpdate(),this.password());//aqui hacemos la peticion
    console.log(this.userService.userUpdate());
    this.modalUpdateUserService.showModalUpdateSwitch();
  }




}

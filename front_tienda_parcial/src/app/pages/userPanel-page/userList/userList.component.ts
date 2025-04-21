import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserApiService } from '../../../services/userApi.service';
import { UserComponentComponent } from "../user-component/user-component.component";

@Component({
  selector: 'app-user-list',
  imports: [UserComponentComponent],
  templateUrl: './userList.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
  //inyectamos el servicio
  userService = inject(UserApiService);


  ngOnInit(): void {
    this.userService.getAllUser();
  }

}

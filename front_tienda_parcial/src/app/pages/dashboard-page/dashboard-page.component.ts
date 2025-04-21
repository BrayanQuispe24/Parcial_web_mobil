import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UserApiService } from '../../services/userApi.service';
import { UserPanelPageComponent } from '../userPanel-page/userPanel-page.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './dashboard-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private router=inject(Router);
  private authService=inject(UserApiService);

  constructor(){}

  public logout(){
    this.authService.logout();
  }
}

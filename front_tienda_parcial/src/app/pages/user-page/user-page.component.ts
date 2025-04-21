import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-user-page',
  imports: [],
  templateUrl: './user-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent { }

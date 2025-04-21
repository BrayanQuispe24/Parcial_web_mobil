import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PersonalItemComponent } from "../personal-item/personal-item.component";
import { PersonalServiceService } from '../../../../services/personalService.service';


@Component({
  selector: 'lista-personal',
  imports: [PersonalItemComponent],
  templateUrl: './lista-personal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaPersonalComponent {
   personalService = inject(PersonalServiceService);

  listaPersonal = this.personalService.listaPersonal;


}

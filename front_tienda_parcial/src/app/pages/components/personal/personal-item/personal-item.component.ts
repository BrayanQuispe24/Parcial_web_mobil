import { Personal } from './../../../../models/personal.interface';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { PersonalServiceService } from '../../../../services/personalService.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'personal-item',
  imports: [],
  templateUrl: './personal-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalItemComponent {
  personalService = inject(PersonalServiceService);
  modalService = inject(ModalService);

  personal = input<Personal>();

  public actualizarPersonal() {
    const personalRepuesto = {
      id: 0,
      nombre: '',
      apellido: '',
      telefono: '',
      direccion: '',
      fecha_nacimiento: '',
      rol: '',
      usuario_id: 0,
      estado: ''
    }
    this.personalService.personalActualizar.set(this.personal() || personalRepuesto);
    this.modalService.mostrarActualizarPersonalSwitch();
  }

}

import { ToastrService } from 'ngx-toastr';
import { PersonalServiceService } from '../../../../services/personalService.service';
import { ModalService } from './../../../../services/modal.service';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

@Component({
  selector: 'formulario-actualizar-personal',
  imports: [],
  templateUrl: './formulario-actualizar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioActualizarComponent {
  modalService = inject(ModalService);
  personalService = inject(PersonalServiceService);
  private toastr = inject(ToastrService);

  personalActualizar = this.personalService.personalActualizar;

  nombre = signal<string>(this.personalActualizar().nombre);
  apellido = signal<string>(this.personalActualizar().apellido);
  telefono = signal<string>(this.personalActualizar().telefono);
  direccion = signal<string>(this.personalActualizar().direccion);
  fecha_nacimiento = signal<string>(this.personalActualizar().fecha_nacimiento);
  rol = signal<string>(this.personalActualizar().rol);
  usuario_id = signal<number>(this.personalActualizar().usuario_id);
  estado = signal<string>(this.personalActualizar().estado);
}

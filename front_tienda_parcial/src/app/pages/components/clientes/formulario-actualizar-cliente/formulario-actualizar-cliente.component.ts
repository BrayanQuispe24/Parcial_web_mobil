import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ModalService } from '../../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { ClienteServiceService } from '../../../../services/clienteService.service';

@Component({
  selector: 'formulario-actualizar-cliente',
  imports: [],
  templateUrl: './formulario-actualizar-cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioActualizarClienteComponent {
  modalService = inject(ModalService);//verificar si es necesario que use los servicios de marca y categoria
  clienteService = inject(ClienteServiceService);
  private toastr = inject(ToastrService);

  clienteActual = this.clienteService.clienteActualizar;

  //atributos para manejar los datos del formulario
  nombre = signal<string>(this.clienteActual().nombre);
  apellido = signal<string>(this.clienteActual().apellido);
  telefono = signal<string>(this.clienteActual().telefono);
  direccion = signal<string>(this.clienteActual().direccion);
  estado = signal<string>(this.clienteActual().estado);
  usuario_id = signal<number>(this.clienteActual().usuario_id);

  cerrarModal(event: Event) {
    event.preventDefault();
    this.modalService.mostrarActualizarClienteSwitch();
  }
  //todo:Hacer que actualice
}

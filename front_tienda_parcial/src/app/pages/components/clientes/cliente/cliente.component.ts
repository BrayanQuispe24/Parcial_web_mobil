import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { ClienteServiceService } from '../../../../services/clienteService.service';
import { ModalService } from '../../../../services/modal.service';
import { Clientes } from '../../../../models/clientes.interface';

@Component({
  selector: 'cliente',
  imports: [],
  templateUrl: './cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClienteComponent {

  clienteService = inject(ClienteServiceService);
  modalService = inject(ModalService);

  cliente = input<Clientes>();

   public actualizarCliente() {
     const personalRepuesto = {
       id: 0,
       nombre: '',
       apellido: '',
       telefono: '',
       direccion: '',
       estado: '',
       usuario_id: 0,
     }
     this.clienteService.clienteActualizar.set(this.cliente() || personalRepuesto);
     this.modalService.mostrarActualizarClienteSwitch();
   }
}
//todo:implementar el actualizar cliente

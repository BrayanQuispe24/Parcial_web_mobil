import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ClienteComponent } from "../cliente/cliente.component";
import { ClienteServiceService } from '../../../../services/clienteService.service';

@Component({
  selector: 'lista-clientes',
  imports: [ClienteComponent],
  templateUrl: './lista-clientes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaClientesComponent {
  clienteService = inject(ClienteServiceService);

  listaClientes = this.clienteService.listaClientes;

}

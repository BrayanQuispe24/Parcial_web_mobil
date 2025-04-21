import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ClienteServiceService } from '../../../../services/clienteService.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'formulario-registro-cliente',
  imports: [],
  templateUrl: './formulario-registro-cliente.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioRegistroClienteComponent {
  private clienteService = inject(ClienteServiceService);
  private toastr = inject(ToastrService);

  nombre = signal<string>('');
  apellido = signal<string>('');
  telefono = signal<string>('');
  direccion = signal<string>('');
  estado = signal<string>('');
  usuario_id = signal<string>('');

  listaClientes = this.clienteService.listaClientes;

  public obtenerUsuarios() {
    this.clienteService.obtenerTodosLosClientes();
  }

  public registrarCliente(event: Event): void {
    event.preventDefault();

    const nombre = this.nombre();
    const apellido = this.apellido();
    const telefono = this.telefono();
    const direccion = this.direccion();
    const estado = this.estado();
    const usuario_id = +this.usuario_id();
    this.clienteService.registrarCliente(nombre, apellido, telefono, direccion, estado, usuario_id).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
        this.nombre.set('');

      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail ||
          e.error?.message ||
          "Error al registrar un Pesonal";

        this.toastr.error(errorMessage, 'Error', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000// Nota que se usa 'timeOut' en lugar de 'timeout'
        });
      }
    })
    //implementar la insercion
  }
  ngOnInit(): void {
    this.obtenerUsuarios();
  }
}

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { ModalService } from '../../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'formulario-actualizar',
  imports: [],
  templateUrl: './formularioActualizar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioActualizarComponent {
  marcaService = inject(MarcaServiceService);
  modalService = inject(ModalService);
  toastr = inject(ToastrService);


  nombre = signal<string>('');
  id = signal<number>(0);
  estado = signal<boolean>(true);

  constructor() {
    effect(() => {
      const marca = this.marcaService.marcaActualizar();
      if (marca) {
        this.nombre.set(marca.nombre);
        this.id.set(marca.id);
        this.estado.set(marca.estado);
      }
    });
  }

  public parsearEstado(cadena: string) {
    if (cadena === "activo") {
      this.estado.set(true);
    } else {
      this.estado.set(false)
    }
  }

  marca = this.marcaService.marcaActualizar();
  public actualizarMarca(event: Event): void {
    const id: number = this.id();
    const nombre: string = this.nombre();
    const estado: boolean = this.estado();
    event.preventDefault();
    this.marcaService.editarMarca(id, nombre, estado).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Actualizacion exitosa");
      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail ||
          e.error?.message ||
          "Error al registrar una categoria";

        this.toastr.error(errorMessage, 'Error', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000// Nota que se usa 'timeOut' en lugar de 'timeout'
        });
      }
    }
    )
    this.modalService.mostarActualizacionMarcaSwitch();
  }
}

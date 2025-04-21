import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { ModalService } from '../../../../services/modal.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'modal-actualizar',
  imports: [],
  templateUrl: './modal-actualizar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalActualizarComponent {
  categoriaService = inject(CategoriaServiceService);
  modalActulizarService = inject(ModalService);
  toastr = inject(ToastrService);


  nombre = signal<string>('');
  id = signal<number>(0);

  constructor() {
    effect(() => {
      const categoria = this.categoriaService.categoriaActualizar();
      if (categoria) {
        this.nombre.set(categoria.nombre);
        this.id.set(categoria.id);
      }
    });
  }
  categoria = this.categoriaService.categoriaActualizar();

  public actualizarCategoria(event: Event): void {
    const id: number = this.id();
    const nombre: string = this.nombre();
    event.preventDefault();
    this.categoriaService.editarCategoria(id, nombre).subscribe({
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
    this.modalActulizarService.mostrarActaulizacionCategoriaSwitch();
  }
}

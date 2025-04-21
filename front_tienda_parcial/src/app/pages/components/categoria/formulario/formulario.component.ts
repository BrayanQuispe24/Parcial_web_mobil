import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CategoriaServiceService } from '../../../../services/categoriaService.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Categorias } from '../../../../models/categorias.interface';

@Component({
  selector: 'formulario',
  imports: [],
  templateUrl: './formulario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioComponent {

  private categoriaService = inject(CategoriaServiceService);
  private toastr = inject(ToastrService);

  nombre = signal<string>('');



  probar(event: Event): void {
    event.preventDefault();
    console.log(this.nombre());
  }

  public registrarCategoria(event: Event): void {
    event.preventDefault();
    const nombre: string = this.nombre();
    this.categoriaService.registrarCategoria(nombre).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
        this.nombre.set('');

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
    })
    //implementar la insercion
  }


}

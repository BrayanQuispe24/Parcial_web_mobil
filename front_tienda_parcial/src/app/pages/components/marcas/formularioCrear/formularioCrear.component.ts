import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'formulario-crear',
  imports: [],
  templateUrl: './formularioCrear.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioCrearComponent {
  private marcaService = inject(MarcaServiceService);
  private toastr = inject(ToastrService);

  nombre = signal<string>('');

  probar(event: Event): void {
    event.preventDefault();
    console.log(this.nombre());
  }

  public registrarMarca(event: Event): void {
    event.preventDefault();
    const nombre: string = this.nombre();
    const estado: boolean = true;
    this.marcaService.registrarMarca(nombre, estado).subscribe({//faltan mas cosas para hacer el registro
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

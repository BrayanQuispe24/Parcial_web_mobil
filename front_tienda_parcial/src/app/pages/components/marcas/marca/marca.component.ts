import { ModalService } from './../../../../services/modal.service';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { Marca } from '../../../../models/marcas.interface';

@Component({
  selector: 'app-marca',
  imports: [],
  templateUrl: './marca.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcaComponent {
  marcaService = inject(MarcaServiceService);
  modalService = inject(ModalService);

  marca = input<Marca>();
  id = computed(() => this.marca()?.id);
  nombre = computed(() => this.marca()?.nombre);
  estado = computed(() => this.marca()?.estado);

  public estadoParse(): string {
    if (this.estado()) {
      return ('Activo')
    } else {
      return ('Eliminado')
    }
  }

  public actualizarMarca(): void {
    console.log('Click ejecutado');
    console.log(this.marca());
    const marca = this.marca() || { id: 1, nombre: 'xD', estado: true };
    this.marcaService.marcaActualizar.set(marca);
    this.modalService.mostarActualizacionMarcaSwitch(); //aqui falta el modal para marca
  }
}

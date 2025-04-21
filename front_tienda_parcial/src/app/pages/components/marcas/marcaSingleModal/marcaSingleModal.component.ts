import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MarcaServiceService } from '../../../../services/marcaService.service';
import { ModalService } from '../../../../services/modal.service';

@Component({
  selector: 'marca-single-modal',
  imports: [],
  templateUrl: './marcaSingleModal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarcaSingleModalComponent {
  public marcaService = inject(MarcaServiceService);
  public modalService=inject(ModalService);

  id = computed(() => this.marcaService.marcaActual()?.id);
  nombre = computed(() => this.marcaService.marcaActual()?.nombre);
  estado=computed(() => this.marcaService.marcaActual()?.estado);
 }

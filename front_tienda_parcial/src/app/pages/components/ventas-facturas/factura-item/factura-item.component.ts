import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Facturas } from '../../../../models/factura.interface';

@Component({
  selector: 'factura-item',
  imports: [],
  templateUrl: './factura-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacturaItemComponent {
  factura=input<Facturas>();

}

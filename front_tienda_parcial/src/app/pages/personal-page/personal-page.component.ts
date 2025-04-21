import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ListaPersonalComponent } from "../components/personal/lista-personal/lista-personal.component";
import { FormularioRegistroComponent } from "../components/personal/formulario-registro/formulario-registro.component";
import { PersonalServiceService } from '../../services/personalService.service';
import { ModalService } from '../../services/modal.service';
import { FormularioActualizarComponent } from "../components/personal/formulario-actualizar/formulario-actualizar.component";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Personal } from '../../models/personal.interface';

@Component({
  selector: 'app-personal-page',
  imports: [ListaPersonalComponent, FormularioRegistroComponent, FormularioActualizarComponent],
  templateUrl: './personal-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalPageComponent {
  personalService = inject(PersonalServiceService);
  modalService=inject(ModalService);

  lista = computed(() => (this.personalService.listaPersonal()));

  ngOnInit(): void {
    this.personalService.obtenerTodoPersonal();
  }
  exportPDF() {
    const doc = new jsPDF();

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    const encabezados = [['ID', 'Nombre', 'Apellido', 'Teléfono', 'Dirección', 'Nacimiento', 'Rol', 'Usuario ID', 'Estado']];
    const filas = this.lista().map((p: Personal) => [
      p.id,
      p.nombre,
      p.apellido,
      p.telefono,
      p.direccion,
      p.fecha_nacimiento,
      p.rol,
      p.usuario_id,
      p.estado
    ]);

    // Cálculo de totales por estado
    const totalesPorEstado: Record<string, number> = {};
    this.lista().forEach(p => {
      totalesPorEstado[p.estado] = (totalesPorEstado[p.estado] || 0) + 1;
    });

    const totalPersonal = this.lista().length;

    const resumenEncabezados = [['Total Personal', ...Object.keys(totalesPorEstado)]];
    const resumenCuerpo = [[totalPersonal, ...Object.values(totalesPorEstado)]];

    let finalY = 0;

    // Tabla de resumen
    autoTable(doc, {
      head: resumenEncabezados,
      body: resumenCuerpo,
      startY: 28,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 139, 34] }, // verde
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text('Reporte de Personal', 14, 15);
        doc.setFontSize(10);
        doc.text(`Fecha: ${fechaStr}`, 14, 22);
        finalY = data.cursor?.y ?? 40;
      }
    });

    // Tabla de detalle
    autoTable(doc, {
      startY: finalY + 10,
      head: encabezados,
      body: filas,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [63, 81, 181] }, // azul
    });

    doc.save('reporte_personal.pdf');
  }


}

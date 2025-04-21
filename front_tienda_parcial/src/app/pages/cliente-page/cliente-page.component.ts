import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ListaClientesComponent } from "../components/clientes/lista-clientes/lista-clientes.component";
import { FormularioRegistroClienteComponent } from "../components/clientes/formulario-registro-cliente/formulario-registro-cliente.component";
import { ClienteServiceService } from '../../services/clienteService.service';
import { ModalService } from '../../services/modal.service';
import { FormularioActualizarClienteComponent } from "../components/clientes/formulario-actualizar-cliente/formulario-actualizar-cliente.component";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Clientes } from '../../models/clientes.interface';

@Component({
  selector: 'cliente-page',
  imports: [ListaClientesComponent, FormularioRegistroClienteComponent, FormularioActualizarClienteComponent],
  templateUrl: './cliente-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientePageComponent {

  clienteService=inject(ClienteServiceService);

  listaClientes = computed(() => (this.clienteService.listaClientes()));
  modalService=inject(ModalService);//falta implementar los modales para los clientes

  ngOnInit(): void {
    this.clienteService.obtenerTodosLosClientes();
  }

//todo:implementar el buscar cliente
exportPDFClientes() {
  const doc = new jsPDF();

  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  doc.setFontSize(16);
  doc.text('Reporte de Clientes', 14, 15);
  doc.setFontSize(10);
  doc.text(`Fecha: ${fechaStr}`, 14, 22);

  // Calcular totales
  const totalClientes = this.listaClientes.length;
  const totalPorEstado: { [estado: string]: number } = {};

  this.listaClientes().forEach((c: Clientes) => {
    if (!totalPorEstado[c.estado]) {
      totalPorEstado[c.estado] = 0;
    }
    totalPorEstado[c.estado]++;
  });

  // Tabla resumen
  const encabezadosResumen = [['Descripción', 'Cantidad']];
  const cuerpoResumen = [
    ['Total de Clientes', totalClientes.toString()],
    ...Object.entries(totalPorEstado).map(([estado, cantidad]) => [estado, cantidad.toString()])
  ];

  let finalY = 0;
  autoTable(doc, {
    startY: 28,
    head: encabezadosResumen,
    body: cuerpoResumen,
    styles: { fontSize: 11 },
    headStyles: { fillColor: [63, 81, 181] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: 'right' }
    },
    didDrawPage: (data) => {
      finalY = data.cursor?.y ?? 0;
    }

  });

  // Detalle de clientes
  const encabezadosClientes = [['ID', 'Nombre', 'Apellido', 'Teléfono', 'Dirección', 'Estado', 'Usuario ID']];
  const cuerpoClientes = this.listaClientes().map((c: Clientes) => [
    c.id,
    c.nombre,
    c.apellido,
    c.telefono,
    c.direccion,
    c.estado,
    c.usuario_id
  ]);

  autoTable(doc, {
    startY: finalY + 10,
    head: encabezadosClientes,
    body: cuerpoClientes,
    styles: { fontSize: 9 },
    headStyles: { fillColor: [0, 150, 136] },
  });

  doc.save('reporte_clientes.pdf');
}

 }

import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { UserListComponent } from "./userList/userList.component";
import { RouterOutlet } from '@angular/router';
import { CreateUserComponentComponent } from "./createUser-component/createUser-component.component";
import { ModalService } from '../../services/modal.service';
import { UpdateUserComponentComponent } from "./updateUser-component/updateUser-component.component";
import { SearchUserComponent } from "./searchUser/searchUser.component";
import { ShowUserSearchedComponent } from "./showUserSearched/showUserSearched.component";
import { PermissionsComponent } from "./permissions/permissions.component";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { UserApiService } from '../../services/userApi.service';
import { UserFullDate } from '../../models/usuario.interface';


@Component({
  selector: 'app-user-panel-page',
  imports: [CreateUserComponentComponent, UserListComponent, UpdateUserComponentComponent, SearchUserComponent, ShowUserSearchedComponent, PermissionsComponent],
  templateUrl: './userPanel-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPanelPageComponent {
  showModal = signal<boolean>(true);
  modalCreateService=inject(ModalService);
  modalUpdateUserService=inject(ModalService);
  modalSearchedService=inject(ModalService);
  mostrarUsuarioBuscado=inject(ModalService);
  modalPermisosService=inject(ModalService);
  usuarioService=inject(UserApiService);

  public lista = computed(() => (this.usuarioService.listUser()));

  exportPDF() {
    const doc = new jsPDF();

    const fecha = new Date();
    const fechaStr = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    // Encabezados y filas para tabla de detalle
    const encabezados = [['ID', 'Correo', 'Nombre', 'Rol', 'Estado']];
    const filas = this.lista().map((u: UserFullDate) => [
      u.id,
      u.email,
      u.first_name,
      u.role,
      u.is_active ? 'Activo' : 'Inactivo'
    ]);

    // Cálculo de resumen
    const total = this.lista().length;
    const activos = this.lista().filter(u => u.is_active).length;
    const inactivos = total - activos;

    const resumenEncabezado = [['Total Usuarios', 'Activos', 'Inactivos']];
    const resumenDatos = [[total, activos, inactivos]];

    let finalY = 0;

    // Tabla de resumen
    autoTable(doc, {
      head: resumenEncabezado,
      body: resumenDatos,
      startY: 28,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 150, 136] }, // verde azulado
      didDrawPage: (data) => {
        doc.setFontSize(16);
        doc.text('Reporte de Usuarios', 14, 15);
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

    doc.save('reporte_usuarios.pdf');
  }


}

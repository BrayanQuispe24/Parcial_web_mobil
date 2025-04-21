import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PersonalServiceService } from '../../../../services/personalService.service';
import { ToastrService } from 'ngx-toastr';
import { UserApiService } from '../../../../services/userApi.service';

@Component({
  selector: 'formulario-registro-personal',
  imports: [],
  templateUrl: './formulario-registro.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormularioRegistroComponent {

  private personalService = inject(PersonalServiceService);
  private toastr = inject(ToastrService);
  private usuarioService = inject(UserApiService);

  nombre = signal<string>('');
  apellido = signal<string>('');
  telefono = signal<string>('');
  direccion = signal<string>('');
  fecha_nacimiento = signal<string>('');
  correo_electronico = signal<string>('');
  rol = signal<string>('');
  usuario_id = signal<number>(0);

  listaPersonal = this.personalService.listaPersonal;
  listaUsuarios = this.usuarioService.listUser;

  public obtenerUsuarios() {
    this.usuarioService.getAllUser();
  }

  public buscarId(correo: string): void {
    const personal = this.listaUsuarios().find((usuario) => (usuario.email == correo));
    console.log(personal);
    if (personal) {
      this.usuario_id.set(personal.id);
    } else {
      this.usuario_id.set(0);
    }
  }

  public registrarPersonal(event: Event): void {
    event.preventDefault();
    console.log(this.fecha_nacimiento);
    this.buscarId(this.correo_electronico());
    if (this.usuario_id() == 0) {
      console.log('No se encontro el correo');
      return;
    }
    const nombre = this.nombre();
    const apellido = this.apellido();
    const telefono = this.telefono();
    const direccion = this.direccion();
    const fecha_nacimiento = this.fecha_nacimiento();
    const rol = this.rol();
    const usuario_id = this.usuario_id();
    const correo_electronico=this.correo_electronico();
    this.personalService.registrarPersonal(nombre, apellido, telefono, direccion, fecha_nacimiento, rol, correo_electronico).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.toastr.success("Registro exitoso");
        this.nombre.set('');

      },
      error: (e: HttpErrorResponse) => {
        const errorMessage = e.error?.detail ||
          e.error?.message ||
          "Error al registrar un Pesonal";

        this.toastr.error(errorMessage, 'Error', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000// Nota que se usa 'timeOut' en lugar de 'timeout'
        });
      }
    })
    //implementar la insercion
  }
  ngOnInit(): void {
    this.obtenerUsuarios();
  }
}

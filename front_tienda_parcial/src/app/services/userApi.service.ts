import { UserUpdate } from './../models/usuario.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { effect, inject, Injectable, signal } from '@angular/core';
import { DataAuth, User, UserFullDate, UserRegister, UserWithRole } from '../models/usuario.interface';
import { Router } from '@angular/router';
import { Permisos } from '../models/permisos.interface';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  //ingectamos http client
  private http = inject(HttpClient);
  private router = inject(Router);
  //private apiUrl = 'http://localhost:8000/';
  private apiUrl = environment.apiUrl;//variable de entorno
  //signals
  public message = signal<string>('');
  //lista de usuarios
  public listUser = signal<UserFullDate[]>([]);
  public userUpdate = signal<UserFullDate | any>({
    id: 0,
    email: '',
    first_name: '',
    role: '',
    is_active: true,
  })
  //usuario que se buscara
  public userSearched = signal<UserFullDate | null>(null);

  //TOKEN Y PERMISOS
  //haremos la persistencia de datos

  public dataAuth = signal<DataAuth>({
    token: '',
    role: ''
  });


  //permisos del usuario actual
  public permisos_currentUser = signal<Permisos>({
    crear: true,
    eliminar: true,
    actualizar: true,
    ver: true,
    usuario_id: 0
  })
  //id del usuario al que se le actualizara los permisos
  //public idUsuarioPermisosCambiar = signal<number | undefined>(0);
  public usuarioActualizarPermiso = signal<any>({});
  public actualizarPermisosUser = signal<Permisos>({
    crear: false,
    eliminar: false,
    actualizar: false,
    ver: false,
    usuario_id: 0
  })


  public getAllUser() {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.dataAuth().token}`
    });
    this.http.get<UserFullDate[]>(`${this.apiUrl}auth/usuarios`, { headers })
      .subscribe((resp) => {
        const listUser: UserFullDate[] = resp.map((user) => {
          const userDate: UserFullDate = {
            id: user.id,
            email: user.email,
            first_name: user.first_name,
            role: user.role,
            is_active: user.is_active
          }
          return userDate;
        })
        this.listUser.set(listUser);
      })
  }

  public getUser(email: string) {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.dataAuth().token}`
    });
    this.http.get<UserFullDate>(`${this.apiUrl}auth/usuarios/buscar?email=${email}`, { headers })
      .subscribe((resp) => {
        const currentUser: UserFullDate = {
          email: resp.email,
          first_name: resp.first_name,
          id: resp.id,
          is_active: resp.is_active,
          role: resp.role
        }
        this.userSearched.set(currentUser);
      })

  }

  public getSingleUser(email: string) {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.dataAuth().token}`
    });
    this.http.get<UserFullDate>(`${this.apiUrl}auth/usuarios?search=${email}`)
  }

  //haremos el login
  public login(user: User):Observable<DataAuth> {
    return this.http.post<DataAuth>(`${this.apiUrl}auth/login/`, user);
  }

  public register(userRegister: UserRegister) {
    this.http.post<string>(`${this.apiUrl}auth/register/`, userRegister)
      .subscribe((resp) => {
        this.message.set(resp);
        console.log(resp);
      });
  }

  public updateUserOnlyAdmin(user: UserFullDate, password: string) {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.dataAuth().token}`
    });
    const userUpdated: UserUpdate = {
      first_name: user.first_name,
      email: user.email,
      role: user.role.toUpperCase(),
      password: password,
    }
    this.http.put<string>(`${this.apiUrl}auth/admin/update/${user.id}/`, userUpdated, { headers })
      .subscribe((resp) => {
        console.log(resp);
        this.getAllUser();
      })

  }

  public registerWithRole(userRegister: UserWithRole) {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.dataAuth().token}`
    });
    this.http.post<string>(`${this.apiUrl}auth/registerByAdmin/`, userRegister, { headers })
      .subscribe((resp) => {
        this.message.set(resp);
        this.getAllUser();
        console.log(resp);
      });
  }

  //con esto haremos que cuando no haya los tokens se salga de la aplicacion
  public logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.dataAuth.set({ token: '', role: '' });
  }
  //metodo para eliminar un usuario
  public deleteUser(id: number | any) {
    const headers = new HttpHeaders({
      'Authorization': `token ${this.dataAuth().token}`
    });
    this.http.delete<any>(`${this.apiUrl}auth/user/delete/${id}/`, { headers })
      .subscribe((resp) => {
        console.log('usuario con id:', id, 'eliminado')
        this.getAllUser();
      })
  }

  public obtenerPermisos(id: number | undefined, callback?: () => void) {
    this.http.get<Permisos[]>(`${this.apiUrl}permiso/obtener?usuario_id=${id}`)
      .subscribe((resp) => {
        if (resp.length > 0) {
          const primerPermiso = resp[0];
          this.actualizarPermisosUser.set({
            crear: primerPermiso.crear,
            eliminar: primerPermiso.eliminar,
            actualizar: primerPermiso.actualizar,
            ver: primerPermiso.ver,
            usuario_id: primerPermiso.usuario_id
          });
        } else {
          console.warn("No se encontraron permisos para el usuario.");
        }
      });
  }

  public actualizarPermisos(permisos: Permisos) {
    this.http.put<string>(`${this.apiUrl}permiso/actualizar/`, permisos)
      .subscribe((resp) => {
        console.log(resp)
      })
  }
  //este lo usaremos cuando hagamos login
  public obtenerPermisosByEmail(email: string | undefined) {
    this.http.get<Permisos>(`${this.apiUrl}permiso/obtener_by_email?email=${email}`)
      .subscribe((resp) => {
        const permisos: Permisos = {
          crear: resp.crear,
          eliminar: resp.eliminar,
          actualizar: resp.actualizar,
          ver: resp.ver,
          usuario_id: 0
        }
        this.permisos_currentUser.set(permisos);
      })
  }
  constructor() {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token') || '';
      const role = localStorage.getItem('role') || '';
      this.dataAuth.set({ token, role });
    }

    effect(() => {
      const { token, role } = this.dataAuth();

      if (!token && typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        this.router.navigate(['login']);
      } else if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
      }
    });
  }

}

import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { authGuardGuard } from './guard/authGuard.guard';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page.component';
import { UserPanelPageComponent } from './pages/userPanel-page/userPanel-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PersonalPageComponent } from './pages/personal-page/personal-page.component';
import { ProductosPageComponent } from './pages/productos-page/productos-page.component';
import { VentasPageComponent } from './pages/ventas-page/ventas-page.component';
import { CategoriaPageComponent } from './pages/categoria-page/categoria-page.component';
import { MarcaPageComponent } from './pages/marca-page/marca-page.component';
import { InventarioPageComponent } from './pages/inventario-page/inventario-page.component';
import { ClientePageComponent } from './pages/cliente-page/cliente-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent
  },
  {
    path: 'register',
    component: RegisterPageComponent
  },
  {
    path: 'dashboard',
    canActivate: [authGuardGuard],
    component: DashboardPageComponent,
    children: [
      {
        path: 'userPanel',
        component: UserPanelPageComponent
      },
      {
        path: '',
        component: HomePageComponent
      },
      {
        path: 'personal',
        component: PersonalPageComponent
      },
      {
        path: 'productos',
        component: ProductosPageComponent
      },
      {
        path: 'ventas',
        component: VentasPageComponent
      },
      {
        path:'categorias',
        component: CategoriaPageComponent
      },
      {
        path:'marcas',
        component:MarcaPageComponent
      },
      {
        path:'inventario',
        component:InventarioPageComponent
      },
      {
        path:'clientes',
        component:ClientePageComponent
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

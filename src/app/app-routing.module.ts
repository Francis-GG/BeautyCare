import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { HomeComponent } from './pages/home/home.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { DepilacionComponent } from './pages/servicios/depilacion/depilacion.component';
import { PeluqueriaComponent } from './pages/servicios/peluqueria/peluqueria.component';
import { ManicureComponent } from './pages/servicios/manicure/manicure.component';
import { ReservasComponent } from './pages/reservas/reservas.component';
import { PreguntfrecuentComponent } from './pages/preguntfrecuent/preguntfrecuent.component';
import { PerfilClienteComponent } from './pages/perfil-cliente/perfil-cliente.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DepilacionAdminComponent } from './pages/admin/depilacion-admin/depilacion-admin.component';
import { PeluqueriaAdminComponent } from './pages/admin/peluqueria-admin/peluqueria-admin.component';
import { ManicureAdminComponent } from './pages/admin/manicure-admin/manicure-admin.component';
import { CalendarioComponent } from './pages/calendario/calendario.component';
import { ClienteAdminComponent } from './pages/admin/cliente-admin/cliente-admin.component';
import { MensajesAdminComponent } from './pages/admin/mensajes-admin/mensajes-admin.component';
import { DashboardAdminComponent } from './pages/admin/dashboard-admin/dashboard-admin.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { P404Component } from './pages/p404/p404.component';

const routes: Routes = [
  {
    path: 'contacto',
    component: ContactoComponent,
  },
  {
    path: '',
    component: HomeComponent
  },

  {
    path: 'calendario',
    component: CalendarioComponent,
    canActivate: [authGuard]
  },
  {
    path: 'preguntfrecuent',
    component: PreguntfrecuentComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'perfil-cliente',
    component: PerfilClienteComponent
  },
  {
    path: 'servicios',
    component: ServiciosComponent
  },
  {
    path: 'servicios/depilacion',
    component: DepilacionComponent
  },
  {
    path: 'servicios/peluqueria',
    component: PeluqueriaComponent
  },
  {
    path: 'servicios/manicure',
    component: ManicureComponent
  },
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivateChild: [adminGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivateChild: [adminGuard],
    children: [
      { path: 'servicios/depilacion', component: DepilacionAdminComponent, data: { title: 'Servicio de Depilación' } },
      { path: 'servicios/peluqueria', component: PeluqueriaAdminComponent, data: { title: 'Servicio de Peluquería' } },
      { path: 'servicios/manicure', component: ManicureAdminComponent, data: { title: 'Servicio de Manicure' } },
      { path: 'reservas', component: ReservasComponent, data: { title: 'Reservas' } },
      { path: 'cliente-admin', component: ClienteAdminComponent, data: { title: 'Clientes' } },
      { path: 'mensajes-admin', component: MensajesAdminComponent, data: { title: 'Mensajes' } },
      { path: '', component: DashboardAdminComponent, data: { title: 'Agenda de Trabajo' } }
    ]
  },
  {
    path: '404',
    component: P404Component
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

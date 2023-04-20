import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { HomeComponent } from './pages/home/home.component';
import { ServiciosComponent } from './pages/servicios/servicios.component';
import { DepilacionComponent } from './pages/servicios/depilacion/depilacion.component';
import { PeluqueriaComponent } from './pages/servicios/peluqueria/peluqueria.component';
import { ManicureComponent } from './pages/servicios/manicure/manicure.component';
import { ReservasComponent } from './pages/reservas/reservas.component';
import {PreguntfrecuentComponent} from './pages/preguntfrecuent/preguntfrecuent.component';
import { PerfilClienteComponent} from './pages/perfil-cliente/perfil-cliente.component';

const routes: Routes = [
  { path: 'contacto',
    component: ContactoComponent,
  },
  { path: '',
    component: HomeComponent
  },
  { path: 'preguntfrecuent',
  component: PreguntfrecuentComponent
  },
  { path: 'perfil-cliente',
  component: PerfilClienteComponent
  },
  { path: 'servicios',
    component: ServiciosComponent
  },
  { path: 'servicios/depilacion',
    component: DepilacionComponent
  },
  { path: 'servicios/peluqueria',
    component: PeluqueriaComponent
  },
  { path: 'servicios/manicure',
    component: ManicureComponent
  },
  { path: 'reservas',
    component: ReservasComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { Component } from '@angular/core';
import {Firestore, collection, getDocs} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';



@Component({
  selector: 'app-peluqueria',
  templateUrl: './peluqueria.component.html',
  styleUrls: ['./peluqueria.component.css']
})
export class PeluqueriaComponent {
  public data: any = [];
  constructor(public firestore: Firestore, private navigationService: NavigationService, private router: Router) {
    this.getData()
  }

  onRedirectClicked() {
    this.navigationService.setRedirectClicked();
    // navigate to /calendario
  }

  getData(){
    const dbInstance = collection(this.firestore, 'categorias/2/servicios');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }
  reservar(itemSeleccionado: any) {
    this.navigationService.setRedirectClicked();
    // Pass the selected data to the 'calendario' page using Angular's Router
    this.router.navigate(['/calendario'], { state: { data: itemSeleccionado } });
    }
}

import { Component } from '@angular/core';
import {Firestore, collection, getDocs} from '@angular/fire/firestore';
import { Router } from '@angular/router';


@Component({
  selector: 'app-manicure',
  templateUrl: './manicure.component.html',
  styleUrls: ['./manicure.component.css']
})
export class ManicureComponent {
  public data: any = [];
  constructor(public firestore: Firestore, private router: Router) {
    this.getData()
  }
  getData(){
    const dbInstance = collection(this.firestore, 'categorias/3/servicios');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }
  reservar(itemSeleccionado: any) {
    // Pass the selected data to the 'calendario' page using Angular's Router
    this.router.navigate(['/calendario'], { state: { data: itemSeleccionado } });
    }
}

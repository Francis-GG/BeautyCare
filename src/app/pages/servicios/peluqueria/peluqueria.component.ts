import { Component } from '@angular/core';
import {Firestore, collection, getDocs} from '@angular/fire/firestore';


@Component({
  selector: 'app-peluqueria',
  templateUrl: './peluqueria.component.html',
  styleUrls: ['./peluqueria.component.css']
})
export class PeluqueriaComponent {
  public data: any = [];
  constructor(public firestore: Firestore) {
    this.getData()
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
}

import { Component } from '@angular/core';
import {Firestore, collection, getDocs} from '@angular/fire/firestore';


@Component({
  selector: 'app-depilacion',
  templateUrl: './depilacion.component.html',
  styleUrls: ['./depilacion.component.css']
})
export class DepilacionComponent {
  public data: any = [];
  constructor(public firestore: Firestore) {
    this.getData()
  }
  getData(){
    const dbInstance = collection(this.firestore, 'categorias/1/servicios');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }
}

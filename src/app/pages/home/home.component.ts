import { Component } from '@angular/core';
import {addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  title = 'Beautycare';
  public data: any = [];
  public dataSucursal:  any = [];





  constructor(public firestore: Firestore) {
    this.getData()
    // this.getDataSucursal()
  }


  getData(){
    const dbInstance = collection(this.firestore, 'categorias');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        console.log("los datos son" + item)
        return {...item.data(), id: item.id}
      })]
    })
  }

  // datos de contecto 

  



}

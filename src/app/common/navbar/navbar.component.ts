import { Component } from '@angular/core';
import {addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public data: any = [];
  constructor(public firestore: Firestore) {
    this.getData()
  }
  
  addData(value: string){
    const dbInstance = collection(this.firestore, 'categorias');
    addDoc(dbInstance, {nombre: value})
    .then(() => {
      alert('Data added successfully')
    })
    .catch((error) => {
      alert(error.message)
    }
  )}
  getData(){
    const dbInstance = collection(this.firestore, 'categorias');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }  
}

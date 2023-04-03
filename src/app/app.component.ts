import { Component, NgModule } from '@angular/core';
import {addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { getStorage, ref } from '@angular/fire/storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Beautycare';
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



import { Component } from '@angular/core';
import {addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  public data: any = [];
  constructor(public firestore: Firestore, private router: Router) {
    this.getData()
  }
  
  onClick(url: string){
    this.router.navigate([url]);
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

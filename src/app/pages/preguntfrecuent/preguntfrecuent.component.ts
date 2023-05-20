import { Component } from '@angular/core';
import { collection } from 'firebase/firestore';
import { getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-preguntfrecuent',
  templateUrl: './preguntfrecuent.component.html',
  styleUrls: ['./preguntfrecuent.component.css']
})
export class PreguntfrecuentComponent {
  public data: any = [];


constructor(public firestore: Firestore){
  this.getData();

}
  // obtiene la informacion del local 
  getData(){
    const dbInstance = collection(this.firestore, 'preguntasFrecuentes');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }
  

}

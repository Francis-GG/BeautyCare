import { Component } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {

  public data: any = [];

  constructor(public firestore: Firestore) {
    this.getDataSucursal();
  }

  // obtiene la informacion del local 
  getDataSucursal() {
    const dbInstance = collection(this.firestore, 'contacto');
    getDocs(dbInstance)
      .then((response) => {
        this.data = [...response.docs.map((item) => {
          return { ...item.data(), id: item.id };

        })]
      })
  }




}

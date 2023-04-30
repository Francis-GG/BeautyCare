import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  fechaSeleccionada: Date = new Date();
  fechaFormateada: string = '';

  ngOnInit() {
    this.fechaFormateada = formatDate(this.fechaSeleccionada, 'EEEE dd MMMM yyyy', 'es');
  }

  // constructor(public firestore: Firestore) {
  //   this.getData()
  // }

  // getData() {
  //   const dbInstance = doc(this.firestore, 'categorias/1/servicios/SERVICIO_ID');
  //   getDoc(dbInstance)
  //   .then((doc) => {
  //     if (doc.exists()) {
  //       this.servicio = {...doc.data(), id: doc.id};
  //     } else {
  //       console.log('El documento no existe!');
  //     }
  //   })
  //   .catch((error) => {
  //     console.log('Error obteniendo el documento:', error);
  //   });
  // }
}

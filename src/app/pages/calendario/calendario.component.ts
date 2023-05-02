import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { Firestore, doc, getDocs, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';



@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  fechaSeleccionada: Date = new Date();
  fechaFormateada: string = '';
  public itemSeleccionado: any;
  public dataContacto: any = [];
  public dataEmpleados: any = [];


  constructor(private router: Router, public firestore: Firestore){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
    this.itemSeleccionado = navigation?.extras.state["data"];
    this.getData();
  }
  }

  ngOnInit() {
    // Le da formato de fecha con palabras al calendario
    this.fechaFormateada = formatDate(this.fechaSeleccionada, 'EEEE dd MMMM yyyy', 'es');
  }


  getData(){
    // Busca los atributos de contacto de la coleccion contacto
    const dbInstance = collection(this.firestore, 'contacto');
    getDocs(dbInstance)
    .then((response) => {
      this.dataContacto = [...response.docs.map((item) => {
        return {...item.data(), id: item.id};
      })]
      // Busca el nombre de empleados en sub coleccion de contacto/empleados
      const empleadosCollection = collection(doc(this.firestore, 'contacto', this.dataContacto[0]?.id), 'empleados');
      getDocs(empleadosCollection).then((response) => {
        this.dataEmpleados = [...response.docs.map((item) => {
          return {...item.data(), id: item.id};
        })]
      })})
  }
}




  
 
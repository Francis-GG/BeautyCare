import { Component, Input } from '@angular/core';
import { formatDate } from '@angular/common';
import { Firestore, doc, getDocs, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DateFilterFn } from '@angular/material/datepicker';




@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent {
  fechaSeleccionada: Date = new Date();
  fechaFormateada: string = '';
  selectedFormatted: string = '';
  public itemSeleccionado: any;
  public dataContacto: any = [];
  public dataEmpleados: any = [];
  minDate!: Date;
  maxDate!: Date;
  selected!: Date | null;
  myFilter = (d: Date | null): boolean => {
    if (d === null) {
      return false; // or any other default behavior
    }
    const day = d.getDay();
    return day !== 0;
  };
  

  @Input('matDatepickerFilter')
  dateFilter!: DateFilterFn<Date>


  constructor(private router: Router, public firestore: Firestore){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
    this.itemSeleccionado = navigation?.extras.state["data"];
    this.getData();
  }
  }


  
  ngOnInit() {
    // Le da formato de fecha con palabras al calendario
    this.minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = maxDate;
    
  }

  onDateSelected(selected: Date): void {
    this.selectedFormatted = formatDate(selected, 'EEEE d \'de\' MMMM \'de\' y', 'es-CL');
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
  

  const currentDate = new Date();
  this.minDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );
  this.maxDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 3,
    currentDate.getDate()
  );
}
}
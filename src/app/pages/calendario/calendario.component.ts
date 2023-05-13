import { Component, Input } from '@angular/core';
import { Firestore, doc, getDocs, collection, setDoc } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { DateFilterFn } from '@angular/material/datepicker';
import { addDoc } from 'firebase/firestore';




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
  timeSlots: string[][] = [
    [], // Sunday (not used)
    ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
    ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
    ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
    ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
    ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'],
    ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30' ,'17:00', '17:30'], // Saturday
  ];
  selectedTime: string | null = null;


  myFilter = (d: Date | null): boolean => {
    if (d === null) {
      return false;
    }
    const day = d.getDay();
    return day !== 0;
  };
  

  @Input('matDatepickerFilter')
  dateFilter!: DateFilterFn<Date>


  constructor(public auth: Auth, private router: Router, public firestore: Firestore){
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
    this.itemSeleccionado = navigation?.extras.state["data"];
    this.getData();
  }
  }


  getTimeSlots(): string[] {
    const selectedDay = this.selected?.getDay() || 0; // Sunday is 0
    return this.timeSlots[selectedDay];
  }

  selectTime(time: string) {
    this.selectedTime = time;
  }


  
  ngOnInit() {
    // Le da formato de fecha con palabras al calendario
    this.minDate = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    this.maxDate = maxDate;
  }
  

  async crearReserva() {
    try {
      const user = this.auth.currentUser;
      if (user && this.itemSeleccionado) {
        const reservaData = {
          servicio: this.itemSeleccionado?.servicio,
          fecha: this.selected?.toLocaleDateString(),
          hora: this.selectedTime,
          profesional: this.dataEmpleados[0]?.nombre || '',
          tiempo: this.itemSeleccionado.tiempo || '',
          precio: this.itemSeleccionado.precio || '',
        };
        const reservaCollectionRef = collection(this.firestore, `users/${user?.uid}/reservas`);
        await addDoc(reservaCollectionRef, reservaData);
      }
    } catch (error) {
      console.error('Error al crear la reserva', error);
    }
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
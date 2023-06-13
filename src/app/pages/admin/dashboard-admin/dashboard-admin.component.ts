import { Component, Input } from '@angular/core';
import { DateFilterFn } from '@angular/material/datepicker';
import { Firestore, getDocs, collection, query, where, doc, updateDoc} from '@angular/fire/firestore';

interface Appointment {
  id: string;
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  precio: string;
  profesional: string;
  servicio: string;
  tiempo: string;
  userId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  estado: string;
}

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {

@Input()
selected!: Date | null;
minDate!: Date;
maxDate!: Date;
fechaSeleccionada: Date = new Date();
fechaFormateada: string = '';
bookedAppointments: Appointment[] = [];

constructor(public firestore: Firestore) { 
  
}



myFilter = (d: Date | null): boolean => {
  if (d === null) {
    return false;
  }
  const day = d.getDay();
  return day !== 0;
};

@Input('matDatepickerFilter')
  dateFilter!: DateFilterFn<Date>


get selectedDate(): Date | null {
  return this.selected;
}

set selectedDate(date: Date | null) {
  this.selected = date;
  if (date) {
    console.log('Fecha seleccionada:', this.selectedDate);
    console.log('Obteniendo datos de fecha:', date);
    this.fetchAppointments(date);
  }
}

isOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
  return start1 < end2 && start2 < end1;
}

stringToDateTime(date: string, time: string): Date {
  const [day, month, year] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

async fetchAppointments(date: Date) {
  const formattedDate = date.toLocaleDateString();
  const appointmentCollectionRef = collection(this.firestore, 'reservas');
  const querySnapshot = await query(appointmentCollectionRef, where('fecha', '==', formattedDate));
  const snapshotDocs = await getDocs(querySnapshot);

  console.log('Datos colleción:', snapshotDocs.docs.map(doc => doc.data()));

  this.bookedAppointments = snapshotDocs.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      fecha: data['fecha'],
      horaInicio: data['horaInicio'],
      horaTermino: data['horaTermino'],
      precio: data['precio'],
      profesional: data['profesional'],
      servicio: data['servicio'],
      tiempo: data['tiempo'],
      userId: data['userId'],
      nombre: data['nombre'],
      apellido: data['apellido'],
      email: data['email'],
      telefono: data['telefono'],
      estado: data['estado'],
    } as Appointment;
  });
}

async changeState(appointment: Appointment) {
  const confirmChange = window.confirm(`Cambiar el estado de la reserva a "${appointment.estado}?"`);
  if (confirmChange) {
    // update the state in Firestore
    const appointmentDoc = doc(this.firestore, 'reservas', appointment.id); // Use appointment.id here
    await updateDoc(appointmentDoc, { 'estado': appointment.estado });
  } else {
    // revert the change
    if (this.selectedDate) {
      this.fetchAppointments(this.selectedDate);
    }
  }
}





ngOnInit() {
  // Le da formato de fecha con palabras al calendario
  this.minDate = new Date();
  this.selectedDate = this.minDate;
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  this.maxDate = maxDate;
}

}
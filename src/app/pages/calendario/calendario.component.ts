import { Component, Input } from '@angular/core';
import { Firestore, doc, getDocs, collection } from '@angular/fire/firestore';
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
  timeSlots: { time: string, isActive: boolean }[][] = [
    [], // Sunday (not used)
    [{ time: '09:00', isActive: false }, { time: '09:30', isActive: false }, { time: '10:00', isActive: false }, { time: '10:30', isActive: false }, { time: '11:00', isActive: false }, { time: '11:30', isActive: false }, { time: '12:00', isActive: false }, { time: '12:30', isActive: false }, { time: '13:00', isActive: false }, { time: '13:30', isActive: false }, { time: '14:00', isActive: false }, { time: '14:30', isActive: false }, { time: '15:00', isActive: false }, { time: '15:30', isActive: false }, { time: '16:00', isActive: false }, { time: '16:30', isActive: false }, { time: '17:00', isActive: false }, { time: '17:30', isActive: false }, { time: '18:00', isActive: false }, { time: '18:30', isActive: false }, { time: '19:00', isActive: false }, { time: '19:30', isActive: false }, { time: '20:00', isActive: false }],
    [{ time: '09:00', isActive: false }, { time: '09:30', isActive: false }, { time: '10:00', isActive: false }, { time: '10:30', isActive: false }, { time: '11:00', isActive: false }, { time: '11:30', isActive: false }, { time: '12:00', isActive: false }, { time: '12:30', isActive: false }, { time: '13:00', isActive: false }, { time: '13:30', isActive: false }, { time: '14:00', isActive: false }, { time: '14:30', isActive: false }, { time: '15:00', isActive: false }, { time: '15:30', isActive: false }, { time: '16:00', isActive: false }, { time: '16:30', isActive: false }, { time: '17:00', isActive: false }, { time: '17:30', isActive: false }, { time: '18:00', isActive: false }, { time: '18:30', isActive: false }, { time: '19:00', isActive: false }, { time: '19:30', isActive: false }, { time: '20:00', isActive: false }],
    [{ time: '09:00', isActive: false }, { time: '09:30', isActive: false }, { time: '10:00', isActive: false }, { time: '10:30', isActive: false }, { time: '11:00', isActive: false }, { time: '11:30', isActive: false }, { time: '12:00', isActive: false }, { time: '12:30', isActive: false }, { time: '13:00', isActive: false }, { time: '13:30', isActive: false }, { time: '14:00', isActive: false }, { time: '14:30', isActive: false }, { time: '15:00', isActive: false }, { time: '15:30', isActive: false }, { time: '16:00', isActive: false }, { time: '16:30', isActive: false }, { time: '17:00', isActive: false }, { time: '17:30', isActive: false }, { time: '18:00', isActive: false }, { time: '18:30', isActive: false }, { time: '19:00', isActive: false }, { time: '19:30', isActive: false }, { time: '20:00', isActive: false }],
    [{ time: '09:00', isActive: false }, { time: '09:30', isActive: false }, { time: '10:00', isActive: false }, { time: '10:30', isActive: false }, { time: '11:00', isActive: false }, { time: '11:30', isActive: false }, { time: '12:00', isActive: false }, { time: '12:30', isActive: false }, { time: '13:00', isActive: false }, { time: '13:30', isActive: false }, { time: '14:00', isActive: false }, { time: '14:30', isActive: false }, { time: '15:00', isActive: false }, { time: '15:30', isActive: false }, { time: '16:00', isActive: false }, { time: '16:30', isActive: false }, { time: '17:00', isActive: false }, { time: '17:30', isActive: false }, { time: '18:00', isActive: false }, { time: '18:30', isActive: false }, { time: '19:00', isActive: false }, { time: '19:30', isActive: false }, { time: '20:00', isActive: false }],
    [{ time: '09:00', isActive: false }, { time: '09:30', isActive: false }, { time: '10:00', isActive: false }, { time: '10:30', isActive: false }, { time: '11:00', isActive: false }, { time: '11:30', isActive: false }, { time: '12:00', isActive: false }, { time: '12:30', isActive: false }, { time: '13:00', isActive: false }, { time: '13:30', isActive: false }, { time: '14:00', isActive: false }, { time: '14:30', isActive: false }, { time: '15:00', isActive: false }, { time: '15:30', isActive: false }, { time: '16:00', isActive: false }, { time: '16:30', isActive: false }, { time: '17:00', isActive: false }, { time: '17:30', isActive: false }, { time: '18:00', isActive: false }, { time: '18:30', isActive: false }, { time: '19:00', isActive: false }, { time: '19:30', isActive: false }, { time: '20:00', isActive: false }],
    [{ time: '10:00', isActive: false }, { time: '10:30', isActive: false }, { time: '11:00', isActive: false }, { time: '11:30', isActive: false }, { time: '12:00', isActive: false }, { time: '12:30', isActive: false }, { time: '13:00', isActive: false }, { time: '13:30', isActive: false }, { time: '14:00', isActive: false }, { time: '14:30', isActive: false }, { time: '15:00', isActive: false }, { time: '15:30', isActive: false }, { time: '16:00', isActive: false }, { time: '16:30', isActive: false }, { time: '17:00', isActive: false }, { time: '17:30', isActive: false }]// Saturday
  ];
  selectedTime: string | null = null;
  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;
  public serviceDurationSlots: number = 1;


  myFilter = (d: Date | null): boolean => {
    if (d === null) {
      return false;
    }
    const day = d.getDay();
    return day !== 0;
  };


  @Input('matDatepickerFilter')
  dateFilter!: DateFilterFn<Date>


  constructor(public auth: Auth, private router: Router, public firestore: Firestore) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.itemSeleccionado = navigation?.extras.state["data"];
      this.setServiceDurationSlots();
      this.getData();
    }
  }
  setServiceDurationSlots() {
    const duration = this.itemSeleccionado.tiempo || '';
    const durationMinutes = Number(duration.split(' ')[0]);
    this.serviceDurationSlots = Math.ceil(durationMinutes / 30);
  }

  getTimeSlots(): { time: string, isActive: boolean }[] {
    const selectedDay = this.selected?.getDay() || 0; // Sunday is 0
    const daySlots = this.timeSlots[selectedDay];
    const validSlots = [];
    for (let i = 0; i <= daySlots.length - this.serviceDurationSlots; i++) {
      validSlots.push(daySlots[i]);
    }
    return validSlots;
  }

  selectTime(timeSlot: { time: string, isActive: boolean }) {
    // Deselect other times
    this.timeSlots.forEach(day =>
      day.forEach(slot => slot.isActive = false)
    );

    // Select the needed slots
    const selectedDay = this.selected?.getDay() || 0;
    const selectedSlotIndex = this.timeSlots[selectedDay].findIndex(slot => slot.time === timeSlot.time);
    const serviceDurationSlots = this.serviceDurationSlots;

    for (let i = 0; i < serviceDurationSlots; i++) {
      this.timeSlots[selectedDay][selectedSlotIndex + i].isActive = true;
    }

    this.selectedStartTime = this.timeSlots[selectedDay][selectedSlotIndex].time;
    this.selectedEndTime = this.timeSlots[selectedDay][selectedSlotIndex + serviceDurationSlots - 1].time;
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
          horaInicio: this.selectedStartTime,
          horaTermino: this.selectedEndTime,
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


  getData() {

    // Busca los atributos de contacto de la coleccion contacto
    const dbInstance = collection(this.firestore, 'contacto');
    getDocs(dbInstance)
      .then((response) => {
        this.dataContacto = [...response.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })]
        // Busca el nombre de empleados en sub coleccion de contacto/empleados
        const empleadosCollection = collection(doc(this.firestore, 'contacto', this.dataContacto[0]?.id), 'empleados');
        getDocs(empleadosCollection).then((response) => {
          this.dataEmpleados = [...response.docs.map((item) => {
            return { ...item.data(), id: item.id };
          })]
        })
      })


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
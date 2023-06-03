import { Component, Input } from '@angular/core';
import { Firestore, collection, doc, getDocs, query, where } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { DateFilterFn } from '@angular/material/datepicker';
import { addDoc } from 'firebase/firestore';

interface Categoria {
  id: string;
  nombre: string;
}

interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  tiempo: string;
}


interface Appointment {
  fecha: string;
  horaInicio: string;
  horaTermino: string;
  precio: string;
  profesional: string;
  servicio: string;
  tiempo: string;
  userId: string;
}

interface TimeSlot {
  time: string;
  isActive: boolean;
  isDisabled: boolean;
}

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent {
  categorias: Categoria[] = [];
  servicios: Servicio[] = [];
  selectedCategory: Categoria | undefined;
  selectedService: Servicio | undefined;
  fechaSeleccionada: Date = new Date();
  fechaFormateada: string = '';
  selectedFormatted: string = '';
  public dataContacto: any = [];
  public dataEmpleados: any = [];
  public idUsuario: any;
  public nombreCliente: any;
  minDate!: Date;
  maxDate!: Date;
  @Input()
  selected!: Date | null;
  timeSlots: TimeSlot[][] = [
    [], // Sunday (not used)
    [{ time: '09:00', isActive: false, isDisabled: false }, { time: '09:30', isActive: false, isDisabled: false }, { time: '10:00', isActive: false, isDisabled: false }, { time: '10:30', isActive: false, isDisabled: false }, { time: '11:00', isActive: false, isDisabled: false }, { time: '11:30', isActive: false, isDisabled: false }, { time: '12:00', isActive: false, isDisabled: false }, { time: '12:30', isActive: false, isDisabled: false }, { time: '13:00', isActive: false, isDisabled: false }, { time: '13:30', isActive: false, isDisabled: false }, { time: '14:00', isActive: false, isDisabled: false }, { time: '14:30', isActive: false, isDisabled: false }, { time: '15:00', isActive: false, isDisabled: false }, { time: '15:30', isActive: false, isDisabled: false }, { time: '16:00', isActive: false, isDisabled: false }, { time: '16:30', isActive: false, isDisabled: false }, { time: '17:00', isActive: false, isDisabled: false }, { time: '17:30', isActive: false, isDisabled: false }, { time: '18:00', isActive: false, isDisabled: false }, { time: '18:30', isActive: false, isDisabled: false }, { time: '19:00', isActive: false, isDisabled: false }, { time: '19:30', isActive: false, isDisabled: false }, { time: '20:00', isActive: false, isDisabled: false }],
    [{ time: '09:00', isActive: false, isDisabled: false }, { time: '09:30', isActive: false, isDisabled: false }, { time: '10:00', isActive: false, isDisabled: false }, { time: '10:30', isActive: false, isDisabled: false }, { time: '11:00', isActive: false, isDisabled: false }, { time: '11:30', isActive: false, isDisabled: false }, { time: '12:00', isActive: false, isDisabled: false }, { time: '12:30', isActive: false, isDisabled: false }, { time: '13:00', isActive: false, isDisabled: false }, { time: '13:30', isActive: false, isDisabled: false }, { time: '14:00', isActive: false, isDisabled: false }, { time: '14:30', isActive: false, isDisabled: false }, { time: '15:00', isActive: false, isDisabled: false }, { time: '15:30', isActive: false, isDisabled: false }, { time: '16:00', isActive: false, isDisabled: false }, { time: '16:30', isActive: false, isDisabled: false }, { time: '17:00', isActive: false, isDisabled: false }, { time: '17:30', isActive: false, isDisabled: false }, { time: '18:00', isActive: false, isDisabled: false }, { time: '18:30', isActive: false, isDisabled: false }, { time: '19:00', isActive: false, isDisabled: false }, { time: '19:30', isActive: false, isDisabled: false }, { time: '20:00', isActive: false, isDisabled: false }],
    [{ time: '09:00', isActive: false, isDisabled: false }, { time: '09:30', isActive: false, isDisabled: false }, { time: '10:00', isActive: false, isDisabled: false }, { time: '10:30', isActive: false, isDisabled: false }, { time: '11:00', isActive: false, isDisabled: false }, { time: '11:30', isActive: false, isDisabled: false }, { time: '12:00', isActive: false, isDisabled: false }, { time: '12:30', isActive: false, isDisabled: false }, { time: '13:00', isActive: false, isDisabled: false }, { time: '13:30', isActive: false, isDisabled: false }, { time: '14:00', isActive: false, isDisabled: false }, { time: '14:30', isActive: false, isDisabled: false }, { time: '15:00', isActive: false, isDisabled: false }, { time: '15:30', isActive: false, isDisabled: false }, { time: '16:00', isActive: false, isDisabled: false }, { time: '16:30', isActive: false, isDisabled: false }, { time: '17:00', isActive: false, isDisabled: false }, { time: '17:30', isActive: false, isDisabled: false }, { time: '18:00', isActive: false, isDisabled: false }, { time: '18:30', isActive: false, isDisabled: false }, { time: '19:00', isActive: false, isDisabled: false }, { time: '19:30', isActive: false, isDisabled: false }, { time: '20:00', isActive: false, isDisabled: false }],
    [{ time: '09:00', isActive: false, isDisabled: false }, { time: '09:30', isActive: false, isDisabled: false }, { time: '10:00', isActive: false, isDisabled: false }, { time: '10:30', isActive: false, isDisabled: false }, { time: '11:00', isActive: false, isDisabled: false }, { time: '11:30', isActive: false, isDisabled: false }, { time: '12:00', isActive: false, isDisabled: false }, { time: '12:30', isActive: false, isDisabled: false }, { time: '13:00', isActive: false, isDisabled: false }, { time: '13:30', isActive: false, isDisabled: false }, { time: '14:00', isActive: false, isDisabled: false }, { time: '14:30', isActive: false, isDisabled: false }, { time: '15:00', isActive: false, isDisabled: false }, { time: '15:30', isActive: false, isDisabled: false }, { time: '16:00', isActive: false, isDisabled: false }, { time: '16:30', isActive: false, isDisabled: false }, { time: '17:00', isActive: false, isDisabled: false }, { time: '17:30', isActive: false, isDisabled: false }, { time: '18:00', isActive: false, isDisabled: false }, { time: '18:30', isActive: false, isDisabled: false }, { time: '19:00', isActive: false, isDisabled: false }, { time: '19:30', isActive: false, isDisabled: false }, { time: '20:00', isActive: false, isDisabled: false }],
    [{ time: '09:00', isActive: false, isDisabled: false }, { time: '09:30', isActive: false, isDisabled: false }, { time: '10:00', isActive: false, isDisabled: false }, { time: '10:30', isActive: false, isDisabled: false }, { time: '11:00', isActive: false, isDisabled: false }, { time: '11:30', isActive: false, isDisabled: false }, { time: '12:00', isActive: false, isDisabled: false }, { time: '12:30', isActive: false, isDisabled: false }, { time: '13:00', isActive: false, isDisabled: false }, { time: '13:30', isActive: false, isDisabled: false }, { time: '14:00', isActive: false, isDisabled: false }, { time: '14:30', isActive: false, isDisabled: false }, { time: '15:00', isActive: false, isDisabled: false }, { time: '15:30', isActive: false, isDisabled: false }, { time: '16:00', isActive: false, isDisabled: false }, { time: '16:30', isActive: false, isDisabled: false }, { time: '17:00', isActive: false, isDisabled: false }, { time: '17:30', isActive: false, isDisabled: false }, { time: '18:00', isActive: false, isDisabled: false }, { time: '18:30', isActive: false, isDisabled: false }, { time: '19:00', isActive: false, isDisabled: false }, { time: '19:30', isActive: false, isDisabled: false }, { time: '20:00', isActive: false, isDisabled: false }],
    [{ time: '10:00', isActive: false, isDisabled: false }, { time: '10:30', isActive: false, isDisabled: false }, { time: '11:00', isActive: false, isDisabled: false }, { time: '11:30', isActive: false, isDisabled: false }, { time: '12:00', isActive: false, isDisabled: false }, { time: '12:30', isActive: false, isDisabled: false }, { time: '13:00', isActive: false, isDisabled: false }, { time: '13:30', isActive: false, isDisabled: false }, { time: '14:00', isActive: false, isDisabled: false }, { time: '14:30', isActive: false, isDisabled: false }, { time: '15:00', isActive: false, isDisabled: false }, { time: '15:30', isActive: false, isDisabled: false }, { time: '16:00', isActive: false, isDisabled: false }, { time: '16:30', isActive: false, isDisabled: false }, { time: '17:00', isActive: false, isDisabled: false }, { time: '17:30', isActive: false, isDisabled: false }]// Saturday
  ];
  selectedTime: string | null = null;
  selectedStartTime: string | null = null;
  selectedEndTime: string | null = null;
  public serviceDurationSlots: number = 1;
  bookedAppointments: Appointment[] = [];
  myFilter = (d: Date | null): boolean => {
    if (d === null) {
      return false;
    }
    const day = d.getDay();
    return day !== 0;
  };


  @Input('matDatepickerFilter')
  dateFilter!: DateFilterFn<Date>

  //Obtiene fecha seleccionada

  get selectedDate(): Date | null {
    return this.selected;
  }

  //Establece fecha seleccionada

  set selectedDate(date: Date | null) {
    this.selected = date;
    if (date) {
      console.log('Fecha seleccionada:', this.selectedDate);
      console.log('Obteniendo datos de fecha:', date);
      this.fetchAppointments(date); // Fetch appointments when the selected date changes.
    }
  }

  constructor(
    public firestore: Firestore,
    public router: Router) {
    this.loadCategorias();
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.idUsuario = navigation?.extras.state["data"];
      this.nombreCliente = navigation?.extras.state["nombre"];
      this.getData();
      }
  }

  getServiceData() {

  }

  //Determina la duración de los slots de tiempo

  setServiceDurationSlots() {
    const duration = this.selectedService?.tiempo || '';
    const durationMinutes = Number(duration.split(' ')[0]);
    this.serviceDurationSlots = Math.ceil(durationMinutes / 30);
  }

  isOverlap(start1: Date, end1: Date, start2: Date, end2: Date): boolean {
    return start1 < end2 && start2 < end1;
  }

  //Pasa las fechas de string a DateTime

  stringToDateTime(date: string, time: string): Date {
    const [day, month, year] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    return new Date(year, month - 1, day, hours, minutes);
  }

  //Función para obtener las horas reservadas

  async fetchAppointments(date: Date) {
    try {
      const formattedDate = date.toLocaleDateString();
      const appointmentCollectionRef = collection(this.firestore, 'reservas');
      const querySnapshot = await query(appointmentCollectionRef, where('fecha', '==', formattedDate));
      const snapshotDocs = await getDocs(querySnapshot);

      console.log('Datos colleción:', snapshotDocs.docs.map(doc => doc.data()));

      this.bookedAppointments = snapshotDocs.docs.map(doc => {
        const data = doc.data();
        return {
          fecha: data['fecha'],
          horaInicio: data['horaInicio'],
          horaTermino: data['horaTermino'],
          precio: data['precio'],
          profesional: data['profesional'],
          servicio: data['servicio'],
          tiempo: data['tiempo'],
          userId: data['userId'],
        } as Appointment;
      });

      console.log('Horas reservadas:', this.bookedAppointments);
      this.getTimeSlots();
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    }
    }



  //Función para obtener los slots de tiempo
  

  getTimeSlots(): TimeSlot[] {
      const selectedDay = this.selectedDate?.getDay() || 0;  // Sunday is 0
      const daySlots = this.timeSlots[selectedDay];
      const validSlots: TimeSlot[] = [];

      if (this.selectedDate) {
        for (let i = 0; i < daySlots.length - this.serviceDurationSlots + 1; i++) {
          const slotStartTime = new Date(this.selectedDate);
          const [slotStartHours, slotStartMinutes] = daySlots[i].time.split(':').map(Number);
          slotStartTime.setHours(slotStartHours, slotStartMinutes);
          const slotEndTime = new Date(slotStartTime.getTime() + this.serviceDurationSlots * 30 * 60000);

          let slotIsBooked = this.bookedAppointments.some(appointment =>
            this.isOverlap(
              slotStartTime, slotEndTime,
              this.stringToDateTime(appointment.fecha, appointment.horaInicio),
              this.stringToDateTime(appointment.fecha, appointment.horaTermino)
            )
          );

          // Also check the next slots if the service lasts longer than 30 minutes
          for (let j = 1; j < this.serviceDurationSlots; j++) {
            const nextSlot = daySlots[i + j];
            if (nextSlot) {
              const nextSlotStartTime = new Date(this.selectedDate);
              const [nextSlotStartHours, nextSlotStartMinutes] = nextSlot.time.split(':').map(Number);
              nextSlotStartTime.setHours(nextSlotStartHours, nextSlotStartMinutes);

              const nextSlotIsBooked = this.bookedAppointments.some(appointment =>
                this.isOverlap(
                  nextSlotStartTime, slotEndTime,
                  this.stringToDateTime(appointment.fecha, appointment.horaInicio),
                  this.stringToDateTime(appointment.fecha, appointment.horaTermino)
                )
              );

              if (nextSlotIsBooked) {
                slotIsBooked = true;
                break;
              }
            }
          }

          if (slotIsBooked) {
            validSlots.push({ ...daySlots[i], isDisabled: true });
          } else {
            validSlots.push({ ...daySlots[i], isDisabled: false });
          }
        }
      }

      return validSlots;
    }


    //Función para seleccionar el slot de tiempo y cambiarlos a verde cuando el usuario los clickea


    selectTime(timeSlot: { time: string, isActive: boolean, isDisabled: boolean }) {
      if (timeSlot.isDisabled) {
        return;
      }

      // Deselect other times
      this.timeSlots.forEach(day =>
        day.forEach(slot => slot.isActive = false)
      );

      // Select the needed slots
      const selectedDay = this.selectedDate?.getDay() || 0;
      const selectedSlotIndex = this.timeSlots[selectedDay].findIndex(slot => slot.time === timeSlot.time);
      const serviceDurationSlots = this.serviceDurationSlots;

      for (let i = 0; i < serviceDurationSlots; i++) {
        this.timeSlots[selectedDay][selectedSlotIndex + i].isActive = true;
      }
      this.selectedStartTime = this.timeSlots[selectedDay][selectedSlotIndex].time;

      if (this.selectedStartTime) {
        // Parse the start time into a Date object
        const [startHours, startMinutes] = this.selectedStartTime.split(':').map(Number);
        const startTime = new Date();
        startTime.setHours(startHours, startMinutes);

        // Add the duration of the service to the start time to get the end time
        const endTime = new Date(startTime.getTime() + this.serviceDurationSlots * 30 * 60000);

        // Format the end time as a string
        this.selectedEndTime = endTime.getHours().toString().padStart(2, '0') + ':' + endTime.getMinutes().toString().padStart(2, '0');
      }
    }



  //Función para crear la reserva

  async crearReserva() {
      try {
        const user = this.idUsuario;
        if (user && this.selectedService) {
          const reservaData = {
            servicio: this.selectedService?.nombre,
            fecha: this.selectedDate?.toLocaleDateString(),
            horaInicio: this.selectedStartTime,
            horaTermino: this.selectedEndTime,
            profesional: this.dataEmpleados[0]?.nombre || '',
            tiempo: this.selectedService.tiempo || '',
            precio: this.selectedService.precio || '',
            userId: this.idUsuario, // Add the userId field to associate the reservation with the user
            nombre: this.nombreCliente,
          };
          const reservaCollectionRef = collection(this.firestore, 'reservas');
          await addDoc(reservaCollectionRef, reservaData);
          alert('Su hora ha sido reservada con éxito!');
          this.router.navigate(['/admin/cliente-admin']);
        }
      } catch (error) {
        console.error('Error al crear la reserva', error);
      }
    }


    //Función para obtener los datos de la base de datos para el contacto y empleados  

    getData() {

      // Busca los atributos de contacto de la coleccion contacto
      const dbInstance = collection(this.firestore, 'contacto');
      getDocs(dbInstance)
        .then((response) => {
          this.dataContacto = [...response.docs.map((item) => {
            console.log(this.dataContacto)
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












//  llama las categorias depilacion,peluqueria y manicure


  async loadCategorias() {
      const categoriasCollectionRef = collection(this.firestore, 'categorias');
      const categoriasQuerySnapshot = await getDocs(categoriasCollectionRef);
      this.categorias = categoriasQuerySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(data['nombre'])
        return { id: doc.id, nombre: data['nombre'] } as Categoria;


      });
    }

  async loadServicios(categoryId: string) {
      const categoryRef = doc(this.firestore, 'categorias', categoryId);
      const serviciosCollectionRef = collection(categoryRef, 'servicios');
      const serviciosQuerySnapshot = await getDocs(serviciosCollectionRef);
      this.servicios = serviciosQuerySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log(data)
        return { id: doc.id, nombre: data['servicio'], descripcion: data['descripcion'], precio: data['precio'], tiempo: data['tiempo'] } as Servicio;
      });
    }

    selectCategory(category: Categoria) {
      this.selectedCategory = category;
      this.selectedService = undefined;  // Clear selected service
      this.loadServicios(category.id);
    }

    selectService(service: Servicio) {
      this.selectedService = service;
      console.log('Service selected:' + service);
      this.setServiceDurationSlots();
      this.getTimeSlots();
    }
  }

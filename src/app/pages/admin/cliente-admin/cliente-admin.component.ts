import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, deleteUser, user } from '@angular/fire/auth';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, getDoc, where, query } from '@angular/fire/firestore';


export interface User {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
}

@Component({
  selector: 'app-cliente-admin',
  templateUrl: './cliente-admin.component.html',
  styleUrls: ['./cliente-admin.component.css']
})
export class ClienteAdminComponent {
  authErrorMessages: any;
  public data: any = [];
  public idUsers: string = '';
  public nombreCliente: string = '';
  public apellidoCliente: string = '';
  public telefonoCliente: string = '';
  public emailCliente: string = '';
  public noResultsFound: boolean = false;
  public originalData: any = [];
  public dataReservas: any = [];
  public idReserva: string = '';
  public fechaReserva: string = '';
  public horaReserva: string = '';
  public servicioReserva: string = '';
  public precioReserva: string = '';
  public tiempoReserva: string = '';
  public idClienteReserva: string = '';

constructor (   
  public auth: Auth,
  public firestore: Firestore){
    this.getData();

  }


  // esta funcion ingresa los valores y llama a la funcion que esta abajo

  async handleRegister(value: any) {
    createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then((response: any) => {
        console.log(response.user);
        this.registerUserData(value.nombre, value.apellido, value.telefono, value.email);
        this.getData();

        })
      .catch((err) => {
        const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al registrarse.';
        alert(errorMessage);
      })
  }

  async registerUserData(nombre: string, apellido: string, telefono: string, email: string) {
    try {
      const user = this.auth.currentUser;
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      setDoc(userDocRef, { nombre, apellido, telefono, email });
      alert('usuario registrado: ' + nombre)
      console.log('usuario registrado: ' + nombre);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getData() {
    const usersCollectionRef = collection(this.firestore, 'users');
    getDocs(usersCollectionRef)
      .then((querySnapshot) => {
        this.originalData = querySnapshot.docs.map((doc) => { 
          console.log(doc.data()); // Debug line
          return { ...doc.data(), id: doc.id };
        });
        this.data = [...this.originalData]; 
        console.log(this.originalData); // Debug line
      })
      .catch((error) => {
        console.error('Error getting documents:', error);
      });
  }


  //función para buscar clientes en general 
  search() {
    let searchTerm = this.nombreCliente.toLowerCase(); 

    if (!searchTerm) {
      this.data = [...this.originalData];
      this.noResultsFound = false;
    } else {
      this.data = this.originalData.filter((item: User) => 
        (item.nombre ? item.nombre.toLowerCase().startsWith(searchTerm) : false) ||
        (item.apellido ? item.apellido.toLowerCase().startsWith(searchTerm) : false) ||
        (item.email ? item.email.toLowerCase().startsWith(searchTerm) : false)
      );
      this.noResultsFound = this.data.length === 0;
    }
  }


//Obtiene los datos de los clientes para el modal y para la tabla

  obtenerIdCliente(idUsers: string, nombreCliente: string, apellidoCliente: string, telefonoCliente: string, emailCliente: string) {
    this.idUsers = idUsers;
    this.nombreCliente = nombreCliente;
    this.apellidoCliente = apellidoCliente;
    this.telefonoCliente = telefonoCliente;
    this.emailCliente = emailCliente;
    

  }


  // editar con modal

  async editarCliente(nombre: string, apellido: string, telefono: string, email: string) {
    try{
      const serviceDocRef = doc(this.firestore, `users/${this.idUsers}`);

      setDoc(serviceDocRef, {nombre, apellido, telefono, email});
      return true;
    } catch (error) {
      console.log('Error al intentar editar el cliente:', error);
      return false;
    }   
  }

  
  async handleEditCliente(formValue: any) {    
    const nombre = formValue['nombre-edit'];
    const apellido = formValue['apellido-edit'];
    const telefono = formValue['telefono-edit'];
    const email = formValue['email-edit'];
    try{
      await this.editarCliente(nombre, apellido, telefono, email);
      alert('cliente actualizado correctamente')
      this.getData();
    }catch(error){
      console.log('Error al intentar actualizar el cliente:', error);
      alert('Error al intentar actualizar el cliente');
    }
  }

 
  
  //
  getDataReserva(idCliente: string) {
    
      const userDocRef = doc(this.firestore, 'users', idCliente);
      const reservasCollectionRef = collection(userDocRef, 'reservas');
      getDocs(reservasCollectionRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnapshot) => {
            const reservaData = { ...docSnapshot.data(), id: docSnapshot.id };
            this.dataReservas.push(reservaData);
          });
  
          // Assuming you want to access the first reservation in the array
          if (this.dataReservas.length > 0) {
            this.idReserva = this.dataReservas[0].id
            this.fechaReserva = this.dataReservas[0].fecha;
            this.horaReserva = this.dataReservas[0].hora;
            this.servicioReserva = this.dataReservas[0].servicio;
            this.precioReserva = this.dataReservas[0].precio;
            this.tiempoReserva = this.dataReservas[0].tiempo;
            this.idClienteReserva = idCliente;
          }
        })
        .catch((error) => {
          console.log('Error al intentar obtener los datos de la reserva:', error);
        });
    
  }

  eliminarReserva( reservaId: string) {
     
      if (confirm('¿Está seguro que desea eliminar esta reserva?')) {
        const serviceDocRef = doc(this.firestore, `users/${this.idClienteReserva}/reservas/${reservaId}`);
        deleteDoc(serviceDocRef)
          .then(() => {
            console.log('Reserva eliminada correctamente');
            this.dataReservas = this.dataReservas.filter((reserva: any) => reserva.id !== reservaId);
            alert('Reserva eliminada correctamente');
          })
          .catch((error) => {
            console.log('Error al intentar eliminar la reserva:', error);
          });
      }
  
  }




}

  



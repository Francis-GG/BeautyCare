import { Component } from '@angular/core';
import { Auth, User, deleteUser } from '@angular/fire/auth';
import { Firestore, getDoc, doc, setDoc, deleteDoc, collection, getDocs } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, deleteObject, uploadString, getDownloadURL } from '@angular/fire/storage';




interface userData{
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
}



@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent {
  public dataUser: any = [];
  public userEmail: string = '';
  public nombrePerfil: string = '';
  public apellidoPerfil: string = '';
  public telefonoPerfil: string = '';
  public emailPerfil: string = '';
  public newPassword: any;
  public dataReservas: any = [];
  public idReserva: string = '';
  public fechaReserva: string = '';
  public horaReserva: string = '';
  public servicioReserva: string = '';
  public precioReserva: string = '';
  public tiempoReserva: string = '';
  public imagePath: string = '';




  constructor(public auth: Auth, public firestore: Firestore, private storage: Storage) {
    this.getDataUser();
    this.getUserEmail();
    this.getDataReserva();
  }

  obtenerDatosPerfil(nombrePerfil: string, apellidoPerfil: string, telefonoPerfil: string, emailPerfil: string) {
    this.nombrePerfil = nombrePerfil;
    this.apellidoPerfil = apellidoPerfil;
    this.telefonoPerfil = telefonoPerfil;
    this.emailPerfil = emailPerfil;
  }

  getUserEmail() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      this.userEmail = user.email || '';
    } else {
      console.log('No authentiica el email del usuario.');
    }
  }

  //funcion para obtener datos de la coleccion USERS de firebase
  getDataUser() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = { ...docSnapshot.data(), id: docSnapshot.id };
            this.dataUser = [userData];
            this.nombrePerfil = this.dataUser[0].nombre;
            this.apellidoPerfil = this.dataUser[0].apellido;
            this.telefonoPerfil = this.dataUser[0].telefono;  
            this.emailPerfil = this.dataUser[0].email;
            this.imagePath = this.dataUser[0].imagePath || '';         
            console.log('nombre de usuario: ' + this.dataUser[0].nombre);
          }
        })
        .catch((error) => {
          console.log('Error al intentar obtener los datos del usuario:', error);
        });
    } else {
      console.log('No hay un usuario autenticado actualmente.');
    }
  }

  getDataReserva() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const reservasCollectionRef = collection(userDocRef, 'reservas');
      getDocs(reservasCollectionRef)
        .then((querySnapshot) => {
          querySnapshot.forEach((docSnapshot) => {
            const reservaData = { ...docSnapshot.data(), id: docSnapshot.id };
            this.dataReservas.push(reservaData);
          });
  
          // Assuming you want to access the first reservation in the array
          if (this.dataReservas.length > 0) {
            this.fechaReserva = this.dataReservas[0].fecha;
            this.horaReserva = this.dataReservas[0].hora;
            this.servicioReserva = this.dataReservas[0].servicio;
            this.precioReserva = this.dataReservas[0].precio;
            this.tiempoReserva = this.dataReservas[0].tiempo;
          }
        })
        .catch((error) => {
          console.log('Error al intentar obtener los datos de la reserva:', error);
        });
    } else {
      console.log('No hay un usuario autenticado actualmente.');
    }
  }
  
  
  

//se invoca con el name del HTML
  async handleEditarPerfil(formValue: any, fileInput: HTMLInputElement){
    const nombre = formValue['nombre-perfil'];
    const apellido = formValue['apellido-perfil'];
    const telefono = formValue ['telefono-perfil'];
    const file = fileInput.files?.[0];

    try{
      if (file) {
        await this.uploadAvatar(file); // Upload the new image
        await this.editarPerfil(nombre, apellido, telefono); // Update profile data
        alert('Perfil editado correctamente');
      } else {
        await this.editarPerfil(nombre, apellido, telefono); // Update profile data without uploading an image
        alert('Perfil editado correctamente');
      }

      this.getDataUser();
      this.getUserEmail();
    }catch{
      console.log('Error al intentar editar el perfil.')
      alert('Error al intentar editar el perfil.')
    }
  } 

  // async uploadImage(file: File) {
  //   const user: User | null = this.auth.currentUser;
  //   if (user) {
  //     const storageRef = ref(this.storage, `users/${user.uid}/profile-image`);
  //     const snapshot = await uploadBytes(storageRef, file);
  //     this.imagePath = snapshot.ref.fullPath;
  //     // Delete the previous image if it exists
  //     const previousImageRef = ref(this.storage, this.imagePath);
  //     await deleteObject(previousImageRef);
  //   } else {
  //     console.log('Error al intentar subir la imagen.');
  //   }
  // }

  async uploadAvatar(file: File) {
    const user: User | null = this.auth.currentUser;
  
    if (!user) {
      return false;
    }
  
    const path = `users/${user.uid}/profile-image`;
    const storageRef = ref(this.storage, path);
  
    try {
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      this.imagePath = imageUrl; // Update the imagePath property
  
      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await setDoc(userDocRef, { imageUrl });
  
      return true;
    } catch (error) {
      console.log('Error while retrieving the download URL:', error);
      return false;
    }
  }




  

  async editarPerfil(nombre: string, apellido: string, telefono: string){
    const user: User | null = this.auth.currentUser;
    if (user){
      const userDocRef = doc(this.firestore, 'users', user.uid);
      setDoc(userDocRef, { nombre, apellido, telefono, imagePath: this.imagePath });
      return true;
    }else {
      console.log('Error al intentar actualizar los datos.')
      return false;
    }
  }


  eliminarReserva(reservaId: string) {
    const user: User | null = this.auth.currentUser;
    if (user) {
      if (confirm('¿Está seguro que desea eliminar esta reserva?')) {
        const serviceDocRef = doc(this.firestore, `users/${user.uid}/reservas/${reservaId}`);
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
    } else {
      console.log('No hay un usuario autenticado actualmente.');
    }
  }

  
  
   //Para eliminar un cliente determinado     

  

   async eliminarCliente() {
     if (confirm('¿Está seguro que desea eliminar su cuenta?')) {
       const user = this.auth.currentUser; // Obtener el usuario actual
       if (user) {
         const clienteDocRef = doc(this.firestore, `users/${user.uid}`);
         try {
           // Eliminar el documento del usuario en Firestore
           await deleteDoc(clienteDocRef);
           // Eliminar el usuario en Authentication
           await deleteUser(user);
           console.log('Cliente eliminado correctamente');
           alert('Cliente eliminado correctamente');
         } catch (error) {
           console.log('Error al intentar eliminar el cliente:', error);
           alert('Error al intentar eliminar el cliente');
         }
       }
     }
   }

  


















































  
  // para la contraseña 

//   async handleEditarPassword(formValue: any){
//     const nuevaPassword = formValue['nueva-password'];
//     const confirmarPassword = formValue['confirmar-password'];

//     try{
//       this.newPassword = nuevaPassword;
//       alert('contraseña actualizada correctamente');
      
//     }catch{
//       console.log('Error al intentar actualizar la constraseña.')
//       alert('Error al intentar  actualizar la constraseña')
//     }
//   }


//  updatePassword(user, newPassword){
  
//  } 
}
  










import { Component, OnInit } from '@angular/core';
import { Auth, User, deleteUser, getAuth, updateEmail, updatePassword } from '@angular/fire/auth';
import { Firestore, getDoc, doc, setDoc, deleteDoc, collection, getDocs, updateDoc, query, where } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, deleteObject, uploadString, getDownloadURL } from '@angular/fire/storage';
import { Router } from '@angular/router';




interface userData {
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
  public emailActual: string = '';
  public loggedIn= false;





  constructor(public auth: Auth,
    public firestore: Firestore,
    private storage: Storage,
    private router: Router) {

    this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.getDataUser();
        this.getUserEmail();
        this.getDataReserva();
      } else {
        this.imagePath = '../../../assets/images/login/5-removebg-preview.png';
      }
    });
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

  //Actualizar email

  async actualizarEmail(email: string) {
    const user: User | null = this.auth.currentUser
    const auth = getAuth()
    updateEmail(user!, email).then(() => {
      alert("Email actualizado.")
      this.getUserEmail();
    }).catch((error) => {
      alert("Error al intentar actualizar el correo.")
    });
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      updateDoc(userDocRef, { email });
      return true;
    } else {
      return false;
    }

  }

  handleEditarCorreo(formValue: any) {
    const correoActual = formValue['email-actual'];
    const correoNuevo = formValue['email-nuevo'];
    const correoConfirmar = formValue['email-confirmar'];

    if (correoNuevo === correoConfirmar) {
      this.actualizarEmail(correoNuevo);
    } else {

      alert("Los correos no coinciden.")
    }
  }

  //funcion para obtener datos de la coleccion USERS de firebase
  getDataUser() {
    const user: User | null = this.auth.currentUser;
    const placeholderImage = '../../../assets/images/login/5-removebg-preview.png'; // Define the placeholder image path
  
    if (user) {
      this.loggedIn = true;
      const userDocRef = doc(this.firestore, 'users', user.uid);
  
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const userData = { ...docSnapshot.data(), id: docSnapshot.id };
            this.dataUser = [userData];
            this.nombrePerfil = this.dataUser[0].nombre;
            this.apellidoPerfil = this.dataUser[0].apellido;
            this.telefonoPerfil = this.dataUser[0].telefono;
            // Use the user's image if it exists, otherwise use the placeholder
            this.imagePath = this.dataUser[0].imagePath ? this.dataUser[0].imagePath : placeholderImage;
            console.log('nombre de usuario: ' + this.dataUser[0].nombre);
          }
        })
        .catch((error) => {
          console.log('Error al intentar obtener los datos del usuario:', error);
        });
    } else {
      console.log('No hay un usuario autenticado actualmente.');
      this.loggedIn = false;
      this.imagePath = placeholderImage;
    }
  }

  getDataReserva() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const queryReservas = query(collection(this.firestore, 'reservas'), where('userId', '==', user.uid));

      getDocs(queryReservas)
        .then((querySnapshot) => {
          this.dataReservas = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return Object.assign({}, data, { id: doc.id });
          });
        })
        .catch((error) => {
          console.log('Error al intentar obtener los datos de la reserva:', error);
        });
    } else {
      console.log('No hay un usuario autenticado actualmente.');
    }
  }





  //se invoca con el name del HTML
  async handleEditarPerfil(formValue: any, fileInput: HTMLInputElement) {
    const nombre = formValue['nombre-perfil'];
    const apellido = formValue['apellido-perfil'];
    const telefono = formValue['telefono-perfil'];
    const file = fileInput.files?.[0];

    try {
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
    } catch {
      console.log('Error al intentar editar el perfil.')
      alert('Error al intentar editar el perfil.')
    }
  }



  async uploadAvatar(file: File) {
    const user: User | null = this.auth.currentUser;

    if (!user) {
      return false;
    }

    const path = `users/${user.uid}/profile-image`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadBytes(storageRef, file);
      const imagePath = await getDownloadURL(storageRef);
      this.imagePath = imagePath; // Update the imagePath property

      const userDocRef = doc(this.firestore, `users/${user.uid}`);
      await updateDoc(userDocRef, { imagePath });

      return true;
    } catch (error) {
      console.log('Error while retrieving the download URL:', error);
      return false;
    }
  }






  async editarPerfil(nombre: string, apellido: string, telefono: string) {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      updateDoc(userDocRef, { nombre, apellido, telefono, imagePath: this.imagePath });
      return true;
    } else {
      console.log('Error al intentar actualizar los datos.')
      return false;
    }
  }

  async actualizarPassword(password: string) {
    const user: User | null = this.auth.currentUser;
    const auth = getAuth();
    try {
      await updatePassword(user!, password);
      alert("Contraseña actualizada.");
    } catch (error) {
      alert("Error al intentar actualizar la contraseña.");
    }
  }


  handleEditarPassword(formValue: any) {
    const passwordNueva = formValue['password-nuevo'];
    const passwordConfirmar = formValue['password-confirmar'];

    if (passwordNueva === passwordConfirmar) {
      this.actualizarPassword(passwordNueva);
    } else {

      alert("Las contraseñas no coinciden.")
    }
  }



  eliminarReserva(reservaId: string) {
    const user: User | null = this.auth.currentUser;
    if (user) {
      if (confirm('¿Está seguro que desea eliminar esta reserva?')) {
        const serviceDocRef = doc(this.firestore, 'reservas', reservaId);
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
          //  eliminarla imagen de avatar}
          const storageRef = ref(this.storage, `users/${user.uid}/profile-image`);
          await deleteObject(storageRef);

          // Eliminar el usuario en Authentication
          await deleteUser(user);
          console.log('Cliente eliminado correctamente');
          alert('Cliente eliminado correctamente');
          this.router.navigate(['/login']);
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











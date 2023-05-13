import { Component } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Firestore, getDoc, doc, setDoc } from '@angular/fire/firestore';

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
  public newPassword: any;


  constructor(public auth: Auth, public firestore: Firestore) {
    this.getDataUser();
    this.getUserEmail();
  }

  obtenerDatosPerfil(nombrePerfil: string, apellidoPerfil: string, telefonoPerfil: string) {
    this.nombrePerfil = nombrePerfil;
    this.apellidoPerfil = apellidoPerfil;
    this.telefonoPerfil = telefonoPerfil;
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

//se invoca con el name del HTML
  async handleEditarPerfil(formValue: any){
    const nombre = formValue['nombre-perfil'];
    const apellido = formValue['apellido-perfil'];
    const telefono = formValue ['telefono-perfil'];

    try{
      console.log(nombre)
      await this.editarPerfil(nombre, apellido, telefono);
      alert('Perfil editado correctamente');
      this.getDataUser();
      this.getUserEmail();
    }catch{
      console.log('Error al intentar editar el perfil.')
      alert('Error al intentar editar el perfil.')
    }
  } 

  async editarPerfil(nombre: string, apellido: string, telefono: string){
    const user: User | null = this.auth.currentUser;
    if (user){
      const userDocRef = doc(this.firestore, 'users', user.uid);
      setDoc(userDocRef, {nombre, apellido, telefono});
      return true;
    }else {
      console.log('Error al intentar actualizar los datos.')
      return false;
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
  










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
  public nombrePlaceholder: string = '';
  public apellidoPlaceholder: string = '';
  public telefonoPlaceholder: string = '';


  constructor(public auth: Auth, public firestore: Firestore) {
    this.getDataUser();
    this.getUserEmail();
    // this.updateDataUser();
 ;
    
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

            // Asigna los valores de los placeholders
            this.nombrePlaceholder = this.dataUser[0].nombre;
            this.apellidoPlaceholder = this.dataUser[0].apellido;
            this.telefonoPlaceholder = this.dataUser[0].telefono;
           
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

  //funcion para actualizar datos de la coleccion USERS de firebase
  //funcion para actualizar datos de la coleccion USERS de firebase
  updateDataUser() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      const nombreInput = document.getElementById('nombre') as HTMLInputElement;
      const apellidoInput = document.getElementById('apellido') as HTMLInputElement;
      const telefonoInput = document.getElementById('telefono') as HTMLInputElement;
      
      const userData: userData = {
        id: user.uid,
        nombre: this.nombrePlaceholder,
        apellido: this.apellidoPlaceholder,
        telefono: this.telefonoPlaceholder,
      };

      setDoc(userDocRef, userData)
        .then(() => {
          console.log('Datos de usuario actualizados correctamente.');
          // Clear the form inputs
          nombreInput.value = '';
          apellidoInput.value = '';
          
        })
        .catch((error) => {
          console.log('Error al intentar actualizar los datos del usuario:', error);
        });
    } else {
      console.log('No hay un usuario autenticado actualmente.');
    }
  }


}
  

// Suggestion 2

// const user: User | null = this.auth.currentUser;
// if (user) {
//   const userDocRef = doc(this.firestore, 'users', user.uid);
//   const nombreInput = document.getElementById('nombreInput') as HTMLInputElement;
//   const apellidoInput = document.getElementById('apellidoInput') as HTMLInputElement;
//   const telefonoInput = document.getElementById('telefonoInput') as HTMLInputElement;
//   updateDoc(userDocRef, {
//     nombre: nombreInput.value,
//     apellido: apellidoInput.value,
//     telefono: telefonoInput.value,
//   })
//     .then(() => {
//       console.log('Datos de usuario actualizados correctamente');
//       // Clear the form inputs
//       nombreInput.value = '';
//       apellidoInput.value = '';
//       telefonoInput.value = '';
//     })
//     .catch((error) => {
//       console.log('Error al intentar actualizar los datos del usuario:', error);
//     });
// } else {
//   console.log('No hay un usuario autenticado actualmente.');
// }


// Suggestion 7

//     const user: User | null = this.auth.currentUser;
// if (user) {
//   const userDocRef = doc(this.firestore, 'users', user.uid);
//   const nombreInput = document.getElementById('nombre') as HTMLInputElement;
//   const apellidoInput = document.getElementById('apellido') as HTMLInputElement;
//   const telefonoInput = document.getElementById('telefono') as HTMLInputElement;
  
//   const userData: userData = {
//     id: user.uid,
//     nombre: nombreInput.value,
//     apellido: apellidoInput.value,
//     telefono: telefonoInput.value,
//   };

//   updateDoc(userDocRef, userData)
//     .then(() => {
//       console.log('Datos de usuario actualizados correctamente.');
//       // Clear the form inputs
//       nombreInput.value = '';
//       apellidoInput.value = '';
//       telefonoInput.value = '';
      
//     })
//     .catch((error) => {
//       console.log('Error al intentar actualizar los datos del usuario:', error);
//     });
// } else {
//   console.log('No hay un usuario autenticado actualmente.');
// }

// Suggestion 9

//     const user: User | null = this.auth.currentUser;
// if (user) {
//   const userDocRef = doc(this.firestore, 'users', user.uid);
//   const nombreInput = document.getElementById('nombrePerfil') as HTMLInputElement;
//   const apellidoInput = document.getElementById('apellidoPerfil') as HTMLInputElement;
//   const telefonoInput = document.getElementById('telefonoPerfil') as HTMLInputElement;
//   const userData: userData = {
//     id: user.uid,
//     nombre: nombreInput.value,
//     apellido: apellidoInput.value,
//     telefono: telefonoInput.value
//   };
//   updateDoc(userDocRef, userData)
//     .then(() => {
//       console.log('Datos actualizados correctamente');
//       this.getDataUser();
//     })
//     .catch((error) => {
//       console.log('Error al intentar actualizar los datos:', error);
//     });
// } else {
//   console.log('No hay un usuario autenticado actualmente.');
// }

























// // <script>
// // // buscar los botones
// // var editAvatarBtn = document.querySelector('.edit-avatar');
// // var editInfoBtn = document.querySelector('.edit-info-btn');
// // var changePasswordBtn = document.querySelector('.change-password');

// // // buscar los modales
// // var editProfileModal = document.querySelector('#edit-profile-modal');
// // var editInfoModal = document.querySelector('#edit-info-modal');
// // var changePasswordModal = document.querySelector('#change-password-modal');

// // // buscar el botón para cerrar el modal
// // var closeBtns = document.querySelectorAll('.close');

// // // abrir los modales
// // editAvatarBtn.addEventListener('click', function() {
// //   editProfileModal.style.display = 'block';
// // });

// // editInfoBtn.addEventListener('click', function() {
// //   editInfoModal.style.display = 'block';
// // });

// // changePasswordBtn.addEventListener('click', function() {
// //   changePasswordModal.style.display = 'block';
// // });

// // // cerrar los modales
// // closeBtns.forEach(function(btn) {
// //   btn.addEventListener('click', function() {
// //     editProfileModal.style.display = 'none';
// //     editInfoModal.style.display = 'none';
// //     changePasswordModal.style.display = 'none';
// //   });
// // });

// // // cerrar el modal si se hace clic fuera del contenido
// // window.addEventListener('click', function(event) {
// //   if (event.target == editProfileModal || event.target == editInfoModal || event.target == changePasswordModal) {
// //     editProfileModal.style.display = 'none';
// //     editInfoModal.style.display = 'none';
// //     changePasswordModal.style.display = 'none';
// //   }
// // });
// // </script>


// /*// Variables globales para la imagen y el botón
// const avatarImg = document.querySelector('#avatarImg');
// const avatarBtn = document.querySelector('#avatarBtn');

// // Controlador de eventos para cargar la imagen del botón
// avatarBtn.addEventListener('change', (e) => {
//   const file = e.target.files[0];
//   const storageRef = firebase.storage().ref(`avatars/${firebase.auth().currentUser.uid}/${file.name}`);
//   const uploadTask = storageRef.put(file);

//   // Controlador de eventos para la carga de la imagen
//   uploadTask.on('state_changed', (snapshot) => {
//     // Actualizar el botón de carga con el progreso de la carga
//     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//     console.log(`Carga de avatar en progreso: ${progress}%`);
//   }, (error) => {
//     // Mostrar mensaje de error si falla la carga de la imagen
//     console.error(`Error en la carga de avatar: ${error.message}`);
//   }, () => {
//     // Actualizar la imagen del avatar en la base de datos
//     uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
//       avatarImg.src = downloadURL;
//       firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
//         avatarURL: downloadURL
//       });
//     });
//   });
// });
// */
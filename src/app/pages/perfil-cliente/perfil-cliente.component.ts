import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent {

}


/*// Variables globales para la imagen y el botón
const avatarImg = document.querySelector('#avatarImg');
const avatarBtn = document.querySelector('#avatarBtn');

// Controlador de eventos para cargar la imagen del botón
avatarBtn.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const storageRef = firebase.storage().ref(`avatars/${firebase.auth().currentUser.uid}/${file.name}`);
  const uploadTask = storageRef.put(file);

  // Controlador de eventos para la carga de la imagen
  uploadTask.on('state_changed', (snapshot) => {
    // Actualizar el botón de carga con el progreso de la carga
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(`Carga de avatar en progreso: ${progress}%`);
  }, (error) => {
    // Mostrar mensaje de error si falla la carga de la imagen
    console.error(`Error en la carga de avatar: ${error.message}`);
  }, () => {
    // Actualizar la imagen del avatar en la base de datos
    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
      avatarImg.src = downloadURL;
      firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
        avatarURL: downloadURL
      });
    });
  });
});
*/
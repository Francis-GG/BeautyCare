import { Component } from '@angular/core';

@Component({
  selector: 'app-perfil-cliente',
  templateUrl: './perfil-cliente.component.html',
  styleUrls: ['./perfil-cliente.component.css']
})
export class PerfilClienteComponent {

}



// <script>
// // buscar los botones
// var editAvatarBtn = document.querySelector('.edit-avatar');
// var editInfoBtn = document.querySelector('.edit-info-btn');
// var changePasswordBtn = document.querySelector('.change-password');

// // buscar los modales
// var editProfileModal = document.querySelector('#edit-profile-modal');
// var editInfoModal = document.querySelector('#edit-info-modal');
// var changePasswordModal = document.querySelector('#change-password-modal');

// // buscar el botón para cerrar el modal
// var closeBtns = document.querySelectorAll('.close');

// // abrir los modales
// editAvatarBtn.addEventListener('click', function() {
//   editProfileModal.style.display = 'block';
// });

// editInfoBtn.addEventListener('click', function() {
//   editInfoModal.style.display = 'block';
// });

// changePasswordBtn.addEventListener('click', function() {
//   changePasswordModal.style.display = 'block';
// });

// // cerrar los modales
// closeBtns.forEach(function(btn) {
//   btn.addEventListener('click', function() {
//     editProfileModal.style.display = 'none';
//     editInfoModal.style.display = 'none';
//     changePasswordModal.style.display = 'none';
//   });
// });

// // cerrar el modal si se hace clic fuera del contenido
// window.addEventListener('click', function(event) {
//   if (event.target == editProfileModal || event.target == editInfoModal || event.target == changePasswordModal) {
//     editProfileModal.style.display = 'none';
//     editInfoModal.style.display = 'none';
//     changePasswordModal.style.display = 'none';
//   }
// });
// </script>


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
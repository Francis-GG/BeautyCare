import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, User, getAuth } from '@angular/fire/auth';
import { Firestore, collection, doc, getDocs, setDoc } from '@angular/fire/firestore';

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

constructor (   
  public auth: Auth,
  public firestore: Firestore){
    this.getData();

  }

  async handleRegister(value: any) {
    createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then((response: any) => {
        console.log(response.user);
        this.registerUserData(value.nombre, value.apellido, value.telefono);
        this.getData();

        })
      .catch((err) => {
        const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al registrarse.';
        alert(errorMessage);
      })
  }

  async registerUserData(nombre: string, apellido: string, telefono: string) {
    try {
      const user = this.auth.currentUser;
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      setDoc(userDocRef, { nombre, apellido, telefono });
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
        this.data = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };

        });
      })
      .catch((error) => {
        console.error('Error getting documents:', error);
      });
  }


  obtenerIdCliente(idUsers: string, nombreCliente: string, apellidoCliente: string, telefonoCliente: string) {
    this.idUsers = idUsers;
    this.nombreCliente = nombreCliente;
    this.apellidoCliente = apellidoCliente;
    this.telefonoCliente = telefonoCliente;
  }




  // editar con modal
  //eliminar sin modal con alerta ??

  async editarCliente(nombre: string, apellido: string, telefono: string) {
    try{
      const serviceDocRef = doc(this.firestore, `users/${this.idUsers}`);

      setDoc(serviceDocRef, {nombre, apellido, telefono});
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
    try{
      await this.editarCliente(nombre, apellido, telefono);
      alert('cliente actualizado correctamente')
      this.getData();
    }catch(error){
      console.log('Error al intentar actualizar el cliente:', error);
      alert('Error al intentar actualizar el cliente');
    }
  }



}



// eliminarServicio(serviceId: string) {
//   if (confirm('¿Está seguro que desea eliminar este servicio?')){
//     const serviceDocRef = doc(this.firestore, `categorias/1/servicios/${serviceId}`);
//     deleteDoc(serviceDocRef)
//       .then(() => {
//         console.log('Servicio eliminado correctamente');
//         this.data = this.data.filter((item: any) => item.id !== serviceId);
//         alert('Servicio eliminado correctamente');
//       })
//       .catch((error) => {
//         console.log('Error al intentar eliminar el servicio:', error);
//       });
//   }
// }
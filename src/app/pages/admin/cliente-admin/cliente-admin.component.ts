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





  


}




    // para editar los datos del registro 

  // async registerUserData(nombre: string, apellido: string, telefono: string) {
  //   try {
  //     const user = this.auth.currentUser;
  //     const userDocRef = doc(this.firestore, `users/${user?.uid}`);
  //     setDoc(userDocRef, { nombre, apellido, telefono });
  //     return true;
  //   } catch (error) {
  //     console.log(error);
  //     return false;
  //   }
  // }

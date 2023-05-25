import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {Firestore, collection, getDocs, doc, setDoc, getDoc} from '@angular/fire/firestore';


declare var document: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(
    public auth: Auth, 
    private router: Router, 
    public firestore: Firestore){

  }

  private authErrorMessages = new Map<string, string>([
    ['auth/user-not-found', 'No se encontró un usuario con este email.'],
    ['auth/wrong-password', 'La contraseña es incorrecta.'],
    ['auth/invalid-email', 'Email inválido.'],
    // Add more error codes and messages as needed
  ]);

  async handleRegister(value: any){
    createUserWithEmailAndPassword(this.auth, value.email, value.password)
    .then((response: any) => {
      console.log(response.user);
      this.registerUserData( value.nombre, value.apellido, value.telefono, value.email);
      alert(`Registro exitoso! Bienvenido ${value.nombre}!`); 
      if(response.user.email?.includes('@admin.cl')){
        this.router.navigate(['admin']);
      }else{
        this.router.navigate(['']);
      }
      
      
    })
    .catch((err) => {
      const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al registrarse.';
      alert(errorMessage);
    })
  }
  // Corresponde a las funciones del Login
  async handleLogin(value: any) {
    signInWithEmailAndPassword(this.auth, value.email, value.password)
      .then(async (response: any) => {
        console.log(response.user);
        const user = response.user;
        const userId = user.uid;
  
        if (user.email?.includes('@admin.cl')) {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['']);
        }
  
        const userDocRef = doc(this.firestore, `users/${userId}`);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const userName = userData[0].nombre;
          console.log('Variable userData: ' + userData)
          alert('Hello, ' + userName + 'Welcome back!');
        }
      })
      .catch((err) => {
        const errorMessage = this.authErrorMessages.get(err.code) || 'An error occurred while logging in.';
        alert(errorMessage);
      });
  }

  

   async registerUserData(nombre: string, apellido: string, telefono: string, email: string) {
	 	try {
	 		const user = this.auth.currentUser; 
	 		const userDocRef = doc(this.firestore, `users/${user?.uid}`);
	 		setDoc(userDocRef, {nombre, apellido, telefono, email});
	 		return true;
	 	} catch (error) {
	 		console.log(error);
	 		return false;
	 	}
	 }

   
  
  
  ngOnInit() {
    document.addEventListener('DOMContentLoaded', () => { 
      const wrapper = document.querySelector(".wrapper") as HTMLElement;
      const signupHeader = document.querySelector(".signup header") as HTMLElement;
      const loginHeader = document.querySelector(".login header") as HTMLElement;

      loginHeader.addEventListener("click", () => {
        wrapper.classList.add("active");
    });
    signupHeader.addEventListener("click", () => {
        wrapper.classList.remove("active");
    });
  }
  )};
}

import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';
import {Firestore, collection, getDocs, doc, setDoc} from '@angular/fire/firestore';


declare var document: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(public auth: Auth, private router: Router, public firestore: Firestore){

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
      this.registerUserData( value.nombre, value.apellido, value.telefono);
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
  async handleLogin(value: any){
    signInWithEmailAndPassword(this.auth, value.email, value.password)
    .then((response: any) => {
      console.log(response.user);
      alert(`Bienvenido ${value.nombre}!`); 
      if(response.user.email?.includes('@admin.cl')){
        this.router.navigate(['admin']);
      }else{
        this.router.navigate(['']);
      }

      })
      .catch((err) => {
        const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al iniciar sesión.';
        alert(errorMessage);
      });
  }

   async registerUserData(nombre: string, apellido: string, telefono: string) {
	 	try {
	 		const user = this.auth.currentUser; 
	 		const userDocRef = doc(this.firestore, `users/${user?.uid}`);
	 		setDoc(userDocRef, {nombre, apellido, telefono});
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

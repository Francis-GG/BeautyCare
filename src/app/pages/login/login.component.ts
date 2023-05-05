import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Router } from '@angular/router';

declare var document: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  
  constructor(public auth: Auth, private router: Router){

  }

  private authErrorMessages = new Map<string, string>([
    ['auth/user-not-found', 'No se encontró un usuario con este email.'],
    ['auth/wrong-password', 'La contraseña es incorrecta.'],
    ['auth/invalid-email', 'Email inválido.'],
    // Add more error codes and messages as needed
  ]);

  handleRegister(value: any){
    createUserWithEmailAndPassword(this.auth, value.email, value.password)
    .then((response: any) => {
      console.log(response.user)
    })
    .catch((err) => {
      const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al iniciar sesión.';
      throw new Error(errorMessage);
    })
  }

  handleLogin(value: any){
    signInWithEmailAndPassword(this.auth, value.email, value.password)
    .then((response: any) => {
      console.log(response.user);
      this.router.navigate(['']);
      })
      .catch((err) => {
        const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al iniciar sesión.';
        alert(errorMessage);
      });
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

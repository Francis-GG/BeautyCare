import { Component, Renderer2, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';

declare var document: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('signupHeader', { static: false }) signupHeader!: ElementRef;
  @ViewChild('loginHeader', { static: false }) loginHeader!: ElementRef;
  @ViewChild('wrapper', { static: false }) wrapper!: ElementRef;
  @ViewChild('registerForm', { static: false }) registerForm!: NgForm;

  constructor(
    private router: Router,
    public firestore: Firestore,
    private authService: AuthService,
    private renderer: Renderer2) {

  }

  // Cambia al estado activo del login, no hay que hacerle doble click o actualizar la página
  ngAfterViewInit() {
    this.renderer.listen(this.loginHeader.nativeElement, 'click', () => {
      this.wrapper.nativeElement.classList.add('active');
    });
    this.renderer.listen(this.signupHeader.nativeElement, 'click', () => {
      this.wrapper.nativeElement.classList.remove('active');
    });
  }

  private authErrorMessages = new Map<string, string>([
    ['auth/user-not-found', 'No se encontró un usuario con este email.'],
    ['auth/wrong-password', 'La contraseña es incorrecta.'],
    ['auth/invalid-email', 'Email inválido.'],
    // Add more error codes and messages as needed
  ]);

  handleRegister() {
    console.log(this.registerForm.valid);
    if (!this.registerForm.valid) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, rellene todos los campos requeridos correctamente.',
        icon: 'error',
      });
      return;
    }

    const value = this.registerForm.value;

    this.authService
      .createUser(value)
      .then((response: any) => {
        console.log(response.user);
        this.authService.registerUserData(
          value.nombre,
          value.apellido,
          value.telefono,
          value.email
        );
        Swal.fire({
          title: 'Registro exitoso!',
          text: ` Bienvenido ${value.nombre}!`,
          icon: 'success',
        });
        if (response.user.email?.includes('@admin.cl')) {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['']);
        }
      })
      .catch((err) => {
        const errorMessage =
          this.authErrorMessages.get(err.code) ||
          'Ha ocurrido un error al registrarse.';
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
        });
      });
  }

  handleLogin(value: any) {
    this.authService
      .loginUser(value)
      .then(async (response: any) => {
        console.log(response.user);
        const user = response.user;
        const userId = user.uid;

        if (user.email?.includes('@beautycareadmin.com')) {
          this.router.navigate(['admin']);
        } else {
          this.router.navigate(['']);
        }

        const userDocRef = doc(this.firestore, `users/${userId}`);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const userName = (userData as any).nombre;
          console.log('Variable userData: ' + userData);
          Swal.fire({
            position: 'top-end',
            title: 'BIENVENIDO!',
            text: `Hola ${userName}, bienvenido de vuelta!`,
            icon: 'success',
            showConfirmButton: false,
            timer: 2500
          });
        }
      })
      .catch((err) => {
        const errorMessage =
          this.authErrorMessages.get(err.code) ||
          'An error occurred while logging in.';
        Swal.fire({
          title: 'Error!',
          text: errorMessage,
          icon: 'error',
        });
      });
  }
}

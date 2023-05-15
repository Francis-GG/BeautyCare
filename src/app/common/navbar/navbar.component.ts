import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Firestore, collection, getDoc, doc} from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';
import { User } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements AfterViewInit, OnInit {
  public data: any = [];
  private subMenu!: HTMLElement;
  public loggedIn= false;
  public avatarUrl: string | null = null;

  constructor(public auth: Auth, public firestore: Firestore, private router: Router) {
    this.subMenu = document.getElementById("subMenu")!
    
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getData();
      }
    });
  }
  
  
  ngAfterViewInit() {
    this.subMenu = document.getElementById("subMenu")!;
    if (!this.subMenu) {
      console.error("Could not find subMenu element");
    }
    //this.getData();
  }
  //Función que abre y cierra el menú
  toggleMenu() {
    const subMenu = document.getElementById("subMenu");
    if (subMenu) {
      subMenu.classList.toggle("open-menu");
    }
    //Función que cierra el menú al hacer click fuera de él
    document.addEventListener("mousedown", (e) => {
      if (e.target !== subMenu && subMenu?.classList.contains("open-menu")) {
        subMenu?.classList.toggle("open-menu");
      }
    });
    
  }

  onClick(url: string){
    this.router.navigate([url]);
  }

  async getData() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      const userDocRef = doc(this.firestore, 'users', user.uid);
      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const userData = { ...docSnapshot.data(), id: docSnapshot.id };
          this.data = [userData];
          this.loggedIn = true; // asigna el valor de loggedIn a true
          this.avatarUrl = this.data[0].avatarUrl; // establece la URL de la imagen del avatar del usuario
          console.log('nombre de usuario: ' + this.data[0].nombre);
        
        }
      } catch (error) {
        console.log('Error en traer los datos al navbar:', error);
      }
    } else {
      console.log('No authenticated user.');
      
    }
  }

  // //funcion para cerrar sesion
  async signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      console.log('adiosito! con éxito;')
      alert(`Adios!` + this.data[0].nombre); 
      this.loggedIn = false;
    }).catch((error) => {
      console.log('Error during sign out:', error);
    });
  }



}  

import { Component, AfterViewInit, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Firestore, collection, getDoc, doc} from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';
import { User } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';
import { AuthService } from 'src/app/services/auth.service'; // Path might vary
import Swal from 'sweetalert2';


interface UserData {
  id: string;
  imagePath?: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  // Include any other properties you expect in a user document
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public data: any = [];
  @ViewChild('subMenu') subMenu!: ElementRef;
  public loggedIn= false;
  public imagePath: string = '';
  public submenuVisible = false;


  constructor(public authService: AuthService, public firestore: Firestore, private router: Router) {
    this.authService.auth.onAuthStateChanged((user) =>{
      if(user){
        this.getData();
      } else{
        this.imagePath = '../../../assets/images/login/5-removebg-preview.png';
      }
    });
  }

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.getData();
      }
    });
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

  toggleSubMenu() {
    this.submenuVisible = !this.submenuVisible;
    if (this.subMenu.nativeElement) {
      if (this.submenuVisible) {
        this.subMenu.nativeElement.classList.add("open-menu");
      } else {
        this.subMenu.nativeElement.classList.remove("open-menu");
      }
    }
  }

  onClick(url: string){
    this.router.navigate([url]);
  }
  async getData() {
    if (this.authService.isLoggedIn()) {
      const user: User | null = this.authService.auth.currentUser;
      if (user) {
        this.loggedIn = true;
        const userDocRef = doc(this.firestore, 'users', user.uid);
        try {
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as any; 
            const userData: UserData = {
              id: docSnapshot.id,
              nombre: data['nombre'] || '', 
              apellido: data['apellido'] || '',
              email: data['email'] || '',
              telefono: data['telefono'] || '',
              imagePath: data['imagePath'], 
            };
            this.data = [userData];
            console.log('nombre de usuario: ' + this.data[0].nombre);
            this.imagePath = userData.imagePath ? userData.imagePath : '../../../assets/images/login/5-removebg-preview.png';
          }
        } catch (error) {
          console.log('Error en traer los datos al navbar:', error);
        }
      } 
    } else {
      console.log('No authenticated user.');
      this.loggedIn = false;
      this.imagePath = '../../../assets/images/login/5-removebg-preview.png';
    }
  }
 
  // //funcion para cerrar sesion



async signOut() {
  this.authService.auth.signOut().then(() => {
    this.router.navigate(['/login']);
    console.log('adiosito! con éxito;')
    Swal.fire({
      title: 'Hasta pronto!',
      text: this.data[0].nombre,
      icon: 'success',
    }); 
    this.loggedIn = false;
    this.getData();
  }).catch((error) => {
    console.log('Error during sign out:', error);
  });
}
}
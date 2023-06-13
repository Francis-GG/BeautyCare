import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Firestore, collection, getDoc, doc} from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';
import { User } from 'firebase/auth';
import { Auth } from '@angular/fire/auth';

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
  private subMenu!: HTMLElement;
  public loggedIn= false;
  public imagePath: string = '';
  public dataUser: any = [];
  public submenuVisible = false;


  constructor(public auth: Auth, public firestore: Firestore, private router: Router) {
    this.subMenu = document.getElementById("subMenu")!
    this.auth.onAuthStateChanged((user) =>{
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
        // this.changeAvatar();

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
    if (this.submenuVisible) {
      this.subMenu.classList.add("open-menu");
    } else {
      this.subMenu.classList.remove("open-menu");
    }
  }

  onClick(url: string){
    this.router.navigate([url]);
  }

  async getData() {
    const user: User | null = this.auth.currentUser;
    if (user) {
      this.loggedIn = true;
      const userDocRef = doc(this.firestore, 'users', user.uid);
      try {
        const docSnapshot = await getDoc(userDocRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data() as any; // Treat `data` as `any` type to allow accessing any properties
          const userData: UserData = {
            id: docSnapshot.id,
            nombre: data['nombre'] || '', // Access properties using index signature
            apellido: data['apellido'] || '', // Access properties using index signature
            email: data['email'] || '', // Access properties using index signature
            telefono: data['telefono'] || '', // Access properties using index signature
            imagePath: data['imagePath'], // Access properties using index signature
          };
          this.data = [userData];
          console.log('nombre de usuario: ' + this.data[0].nombre);
          this.imagePath = userData.imagePath ? userData.imagePath : this.imagePath; // Set imagePath to the user's profile image if it exists
        }
      } catch (error) {
        console.log('Error en traer los datos al navbar:', error);
      }
    } else {
      console.log('No authenticated user.');
      this.loggedIn = false;
      this.imagePath = '../../../assets/images/login/5-removebg-preview.png';
       // Set imagePath to the placeholder image if no user is logged in
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

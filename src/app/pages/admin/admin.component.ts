import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Auth } from '@angular/fire/auth';
import Swal from 'sweetalert2';
declare var document: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  authErrorMessages: any;
  public data: any = [];
  public loggedIn = false;


  constructor(
    private router: Router,
    public auth: Auth,
    public titleService: Title) { }

  ngOnInit() {
    document.addEventListener('DOMContentLoaded', () => {
      const main = document.getElementsByTagName('main')[0];
      const modeToggle = document.getElementsByClassName('mode-toggle')[0];
      const sidebar = document.getElementsByTagName('nav')[0];
      const sidebarToggle = document.getElementsByClassName('sidebar-toggle')[0];
      const dropdownToggles = document.querySelectorAll('.dropdown > a');

      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          const title = this.getTitle(this.router.routerState, this.router.routerState.root).join(' | ');
          this.titleService.setTitle(title);
        }
      });

      modeToggle.addEventListener('click', function () {
        main.classList.toggle('dark');
      });
      sidebarToggle.addEventListener('click', function () {
        sidebar.classList.toggle('close');
      });
      dropdownToggles.forEach((toggle: HTMLElement) => {
        toggle.addEventListener('click', function (e) {
          e.preventDefault();
          const li = this.parentNode as HTMLElement;
          if (li) {
            li.classList.toggle('active');
          }
        });
      });
    });

  }
  private getTitle(state: any, parent: any): string[] {
    const data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(...this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }

  // función para cerrar sesión 
  async signOut() {
    this.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      console.log('adiosito! con éxito;')
      Swal.fire({
        title: 'Hasta pronto!',
        text: this.data[0].nombre,
        icon: 'success',
      });
      
      this.loggedIn = false;
    }).catch((error) => {
      console.log('Error during sign out:', error);
    });


  }
}

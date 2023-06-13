import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationService } from 'src/app/services/navigation.service';
declare var document: any;

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit{
  currentRoute!: string;

  constructor(private navigationService: NavigationService ,private router: Router){}

  onRedirectClick() {
    this.navigationService.setRedirectClicked();
  }
  
  ngOnInit() {
    this.currentRoute = this.router.url;
    if (this.currentRoute === '/servicios/depilacion') {
      document.getElementById('depilacion').setAttribute('checked', 'checked');
    } else if (this.currentRoute === '/servicios/peluqueria') {
      document.getElementById('peluqueria').setAttribute('checked', 'checked');
    } else if (this.currentRoute === '/servicios/manicure') {
      document.getElementById('manicure').setAttribute('checked', 'checked');
    }
  }
}

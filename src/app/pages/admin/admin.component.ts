import { Component } from '@angular/core';
declare var document: any;

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent {
  ngOnInit() {
    document.addEventListener('DOMContentLoaded', () => {
      const main = document.getElementsByTagName('main')[0];
      const modeToggle = document.getElementsByClassName('mode-toggle')[0];
      const sidebar = document.getElementsByTagName('nav')[0];
      const sidebarToggle = document.getElementsByClassName('sidebar-toggle')[0];
      modeToggle.addEventListener('click', function() {
        main.classList.toggle('dark');
      });
      sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('close');
      });
    });
    
  }
}

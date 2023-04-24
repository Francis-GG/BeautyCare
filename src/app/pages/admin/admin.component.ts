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
      const toggle = document.getElementsByClassName('mode-toggle')[0];
      toggle.addEventListener('click', function() {
        main.classList.toggle('dark');
      });
    });
    
  }
}

import { Component } from '@angular/core';
declare var document: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
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

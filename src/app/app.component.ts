import { Component, NgModule } from '@angular/core';
import { addDoc, Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Beautycare';
  public data: any = [];

  constructor(public firestore: Firestore, private router: Router) {
    this.getData();
  }

  addData(value: string) {
    const dbInstance = collection(this.firestore, 'categorias');
    addDoc(dbInstance, { nombre: value })
      .then(() => {
        alert('Data added successfully');
      })
      .catch((error) => {
        alert(error.message);
      });
  }

  getData() {
    const dbInstance = collection(this.firestore, 'categorias');
    getDocs(dbInstance).then((response) => {
      this.data = [
        ...response.docs.map((item) => {
          return { ...item.data(), id: item.id };
        }),
      ];
    });
  }

  showNavbarAndFooter(): boolean {
    return this.router.url !== '/admin';
  }
}


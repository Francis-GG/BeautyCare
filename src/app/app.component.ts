import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'BeautyCare';
  imagenesCarrusel: any[];

  constructor(private db: AngularFireDatabase) {}

  ngOnInit() {
    this.db.list('carrusel').valueChanges().subscribe(imagenes: any => {
      this.imagenesCarrusel = imagenes;
    });
  }

}

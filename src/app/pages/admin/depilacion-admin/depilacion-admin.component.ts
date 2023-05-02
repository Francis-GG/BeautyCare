import { Component } from '@angular/core';
import { Firestore, collection, getDocs, addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-depilacion-admin',
  templateUrl: './depilacion-admin.component.html',
  styleUrls: ['./depilacion-admin.component.css']
})
export class DepilacionAdminComponent {
  
  public data: any = [];
  public nextId: number = 0;

  constructor(public firestore: Firestore) {
    this.getNextId();
    this.getData();
  }

  getNextId() {
    const dbInstance = collection(this.firestore, 'categorias/1/servicios');
    getDocs(dbInstance).then((response) => {
      const nextId = response.size + 1;
      const idInput = document.getElementById('idServicioDepilacion') as HTMLInputElement;
      idInput.value = nextId.toString();
    });
  }

  getData(){
    const dbInstance = collection(this.firestore, 'categorias/1/servicios');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }
  
  addServicio() {
    const nombreInput = document.getElementById('nombreServicioDepilacion') as HTMLInputElement;
    const descripcionInput = document.getElementById('descripcionServicioDepilacion') as HTMLInputElement;
    const duracionInput = document.getElementById('duracionServicioDepilacion') as HTMLInputElement;
    const precioInput = document.getElementById('precioServicioDepilacion') as HTMLInputElement;
  
    const servicio = {
      id: this.nextId,
      nombre: nombreInput.value,
      descripcion: descripcionInput.value,
      duracion: duracionInput.value,
      precio: precioInput.value,
    };
  
    const dbInstance = collection(this.firestore, 'categorias/1/servicios');
    addDoc(dbInstance, servicio)
      .then(() => {
        console.log('Servicio añadido correctamente');
        // Clear the form inputs
        nombreInput.value = '';
        descripcionInput.value = '';
        duracionInput.value = '';
        precioInput.value = '';
        // Increment the nextId for the next service
        this.nextId++;
        // Update the ID input field in the modal
        const idInput = document.getElementById('idServicioDepilacion') as HTMLInputElement;
        idInput.value = this.nextId.toString();
      })
      .catch((error) => {
        console.error('Error al añadir el servicio:', error);
      });
  }

}

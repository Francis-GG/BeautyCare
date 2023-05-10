import { Component } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, deleteDoc } from '@angular/fire/firestore';


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
  eliminarServicio(serviceId: string) {
    if (confirm('¿Está seguro que desea eliminar este servicio?')){
      const serviceDocRef = doc(this.firestore, `categorias/1/servicios/${serviceId}`);
      deleteDoc(serviceDocRef)
        .then(() => {
          console.log('Servicio eliminado correctamente');
          this.data = this.data.filter((item: any) => item.id !== serviceId);
          alert('Servicio eliminado correctamente');
        })
        .catch((error) => {
          console.log('Error al intentar eliminar el servicio:', error);
        });
    }
  }
}

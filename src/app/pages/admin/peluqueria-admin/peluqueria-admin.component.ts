import { Component } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-peluqueria-admin',
  templateUrl: './peluqueria-admin.component.html',
  styleUrls: ['./peluqueria-admin.component.css']
})
export class PeluqueriaAdminComponent {
  public data: any = [];
  public nextId: number = 0;

  constructor(public firestore: Firestore) {
    this.getNextId();
    this.getData();
  }

  getNextId() {
    const dbInstance = collection(this.firestore, 'categorias/2/servicios');
    getDocs(dbInstance).then((response) => {
      const nextId = response.size + 1;
      const idInput = document.getElementById('idServicioPeluqueria') as HTMLInputElement;
      idInput.value = nextId.toString();
    });
  }

  getData(){
    const dbInstance = collection(this.firestore, 'categorias/2/servicios');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }
  eliminarServicio(serviceId: string) {
    Swal.fire({
      title: '¿Está seguro que desea eliminar este servicio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'No, cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const serviceDocRef = doc(this.firestore, `categorias/2/servicios/${serviceId}`);
        deleteDoc(serviceDocRef)
          .then(() => {
            console.log('Servicio eliminado correctamente');
            this.data = this.data.filter((item: any) => item.id !== serviceId);
            Swal.fire({
              title: 'Éxito!',
              text: 'Servicio eliminado correctamente',
              icon: 'success',
            });
          })
          .catch((error) => {
            console.log('Error al intentar eliminar el servicio:', error);
          });
      }
    });
  }  
}

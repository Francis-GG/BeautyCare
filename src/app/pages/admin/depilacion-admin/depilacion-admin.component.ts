import { Component } from '@angular/core';
import { Firestore, collection, getDocs, updateDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-depilacion-admin',
  templateUrl: './depilacion-admin.component.html',
  styleUrls: ['./depilacion-admin.component.css']
})
export class DepilacionAdminComponent {
  
  public data: any = [];
  public nextId: number = 0;
  public idServicio: string = '';
  public nombreServicio: string = '';
  public descripcionServicio: string = '';
  public precioServicio: string = '';
  public duracionServicio: string = '';

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

  obtenerIdServicio(idServicio: string, nombreServicio: string, descripcionServicio: string, duracionServicio: string, precioServicio: string) {
    this.idServicio = idServicio;
    this.nombreServicio = nombreServicio;
    this.descripcionServicio = descripcionServicio;
    this.precioServicio = precioServicio;
    this.duracionServicio = duracionServicio;
  }

  async editarServicio(servicio: string, descripcion: string, precio: string, tiempo: string) {
    try{
      const serviceDocRef = doc(this.firestore, `categorias/1/servicios/${this.idServicio}`);
      setDoc(serviceDocRef, {servicio, descripcion, precio, tiempo});
      return true;
    } catch (error) {
      console.log('Error al intentar editar el servicio:', error);
      return false;
    }   
  }

  async handleEditService(formValue: any) {    
    const nombre = formValue['nombre-edit-servicio'];
    const descripcion = formValue['descripcion-edit-servicio'];
    const precio = formValue['precio-edit-servicio'];
    const duracion = formValue['duracion-edit-servicio'];
    try{
      await this.editarServicio(nombre, descripcion, precio, duracion);
      Swal.fire({
        title: 'Éxito!',
        text: 'Servicio actualizado correctamente',
        icon: 'success',
      });      this.getData();
    }catch(error){
      console.log('Error al intentar actualizar el servicio:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al intentar actualizar el servicio',
        icon: 'error',
      });    }
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
        const serviceDocRef = doc(this.firestore, `categorias/1/servicios/${serviceId}`);
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

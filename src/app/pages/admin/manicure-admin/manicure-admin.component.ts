import { Component } from '@angular/core';
import { Firestore, collection, getDocs, addDoc, doc, deleteDoc } from '@angular/fire/firestore';
import { setDoc } from 'firebase/firestore';


@Component({
  selector: 'app-manicure-admin',
  templateUrl: './manicure-admin.component.html',
  styleUrls: ['./manicure-admin.component.css']
})
export class ManicureAdminComponent {
  
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
    const dbInstance = collection(this.firestore, 'categorias/3/servicios');
    getDocs(dbInstance).then((response) => {
      const nextId = response.size + 1;
      const idInput = document.getElementById('idServicioManicure') as HTMLInputElement;
      idInput.value = nextId.toString();
    });
  }

  getData(){
    const dbInstance = collection(this.firestore, 'categorias/3/servicios');
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
      const serviceDocRef = doc(this.firestore, `categorias/3/servicios/${this.idServicio}`);
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
      alert('Servicio actualizado correctamente')
      this.getData();
    }catch(error){
      console.log('Error al intentar actualizar el servicio:', error);
      alert('Error al intentar actualizar el servicio');
    }
  }







  eliminarServicio(serviceId: string) {
    if (confirm('¿Está seguro que desea eliminar este servicio?')){
      const serviceDocRef = doc(this.firestore, `categorias/3/servicios/${serviceId}`);
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

import { Component } from '@angular/core';
import { Firestore, collection, getDocs, updateDoc, doc, deleteDoc, query, orderBy } from '@angular/fire/firestore';

@Component({
  selector: 'app-mensajes-admin',
  templateUrl: './mensajes-admin.component.html',
  styleUrls: ['./mensajes-admin.component.css']
})
export class MensajesAdminComponent {
  public data: any = [];
  
  

  constructor(
    public firestore: Firestore){
    this.getDataMensajes();

  }


  getDataMensajes(){
    const dbInstance = collection(this.firestore, 'formcontact');
    getDocs(query(dbInstance, orderBy('fecha', 'desc')))
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id}
      })]
    })
  }

  eliminarMensaje(mensajeId: string) {
    if (confirm('¿Está seguro que desea eliminar este mensaje?')){
      const serviceDocRef = doc(this.firestore, `formcontact/${mensajeId}`);
      deleteDoc(serviceDocRef)
        .then(() => {
          console.log('Mensaje eliminado correctamente');
          this.data = this.data.filter((item: any) => item.id !== mensajeId);
          alert('Mensaje eliminado correctamente');
        })
        .catch((error) => {
          console.log('Error al intentar eliminar el mensaje:', error);
        });
    }
  }






}
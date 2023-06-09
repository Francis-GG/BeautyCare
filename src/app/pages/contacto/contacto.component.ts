  /// <reference types="google.maps" />
  import {setDoc, Firestore, collection, getDocs, doc} from '@angular/fire/firestore';
  import { getStorage, ref} from '@angular/fire/storage';
  import { AfterViewInit, Component, ViewChild  } from '@angular/core';
  import { NgForm } from '@angular/forms'
  import Swal from 'sweetalert2';


  

  @Component({
    selector: 'app-contacto',
    templateUrl: './contacto.component.html',
    styleUrls: ['./contacto.component.css']
  })
  export class ContactoComponent implements AfterViewInit {
    public data: any = [];
    public nextId: number = 0;

    @ViewChild('contactoForm') contactoForm!: NgForm;


    constructor(public firestore: Firestore) {
      this.getDataSucursal();
      //this.nextId = this.getNextId();
      this.getNextId();
    }

    ngAfterViewInit(): void {
      initMap();
    }

    getNextId(){
      const dbInstance = collection(this.firestore, 'formcontact');
      return getDocs(dbInstance).then((response) =>{
        return response.size + 1;
      })
    }

    async handleContacto(formValue:any){
      // siempre llamarlos desde name
      const id = (await this.getNextId()).toString();
      const nombre = formValue['formcontactnombre'];
      const apellido = formValue['formcontactapellido'];
      const email = formValue['formcontactaemail'];
      const telefono = formValue['formcontactatelefono'];
      const texto = formValue['formcontacttexto'];

      try{
        await this.submitContacto(id, nombre, apellido, email, telefono, texto);
      //para limpiar los campos
        this.getNextId();
        this.contactoForm.resetForm();

      }catch{
        console.log('Ocurrió un error al intentar enviar su mensaje.')
        Swal.fire({
          title: 'Error!',
          text: 'Ocurrió un error al intentar enviar su mensaje.',
          icon: 'error',
        });
      }
    }

    async submitContacto(id: string ,nombre: string, apellido: string, email: string, telefono: string, texto: string){
      const currentTime = new Date();
      const fecha = currentTime.toLocaleString();
      const hora = currentTime.toLocaleTimeString();
    
      await Swal.fire({
        title: '¿Está seguro que desea enviar el formulario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'No, cancelar',
      }).then((result) => {
        if (result.isConfirmed) {
          const contactoDocRef = doc(this.firestore, `formcontact/${id}`);
          setDoc(contactoDocRef, {nombre, apellido, email, telefono, texto, fecha, hora})
            .then(() => {
              Swal.fire({
                title: 'Éxito!',
                text: 'Formulario enviado con éxito.',
                icon: 'success',
              });
            })
            .catch((error) =>{
              Swal.fire({
                title: 'Error!',
                text: 'El formulario no se ha enviado.',
                icon: 'error',
              });
            });
        }
      });
    }
    
    // obtiene la informacion del local 
    getDataSucursal(){
      const dbInstance = collection(this.firestore, 'contacto');
      getDocs(dbInstance)
      .then((response) => {
        this.data = [...response.docs.map((item) => {
          return {...item.data(), id: item.id};
        })]
      })
    }
  }

  // almacenar los datos del formulario


  // submitForm(){

  // }



  // para Google Maps

  let map;
  async function initMap(): Promise<void> {
    const position = { lat: -33.40838567608921, lng: -70.56459463109759};
    const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
    const { Marker } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

    map = new Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 15,
        center: position,
        mapId: 'bfcaf029ff1ccc3c'
      }
    );

    const marker = new Marker({
      map: map,
      position: position,
      title: "Apoquindo 6415"
    });
  }

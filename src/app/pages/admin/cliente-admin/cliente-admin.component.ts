import { Component } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, getAuth, deleteUser, user } from '@angular/fire/auth';
import { Firestore, collection, doc, getDocs, setDoc, deleteDoc, getDoc, where, query } from '@angular/fire/firestore';

@Component({
  selector: 'app-cliente-admin',
  templateUrl: './cliente-admin.component.html',
  styleUrls: ['./cliente-admin.component.css']
})
export class ClienteAdminComponent {
  authErrorMessages: any;
  public data: any = [];
  public idUsers: string = '';
  public nombreCliente: string = '';
  public apellidoCliente: string = '';
  public telefonoCliente: string = '';
  public emailCliente: string = '';
  public noResultsFound: boolean = false;

constructor (   
  public auth: Auth,
  public firestore: Firestore){
    this.getData();

  }

  async handleRegister(value: any) {
    createUserWithEmailAndPassword(this.auth, value.email, value.password)
      .then((response: any) => {
        console.log(response.user);
        this.registerUserData(value.nombre, value.apellido, value.telefono, value.email);
        this.getData();

        })
      .catch((err) => {
        const errorMessage = this.authErrorMessages.get(err.code) || 'Ha ocurrido un error al registrarse.';
        alert(errorMessage);
      })
  }

  async registerUserData(nombre: string, apellido: string, telefono: string, email: string) {
    try {
      const user = this.auth.currentUser;
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      setDoc(userDocRef, { nombre, apellido, telefono, email });
      alert('usuario registrado: ' + nombre)
      console.log('usuario registrado: ' + nombre);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  getData() {
    const usersCollectionRef = collection(this.firestore, 'users');
    getDocs(usersCollectionRef)
      .then((querySnapshot) => {
        this.data = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };

        });
      })
      .catch((error) => {
        console.error('Error getting documents:', error);
      });
  }


//codigo bueno para nombre pero debe ser exacto el ingreso
  // searchClientes() {
  //   const usersCollectionRef = collection(this.firestore, 'users');
  //   const queryRef = query(usersCollectionRef, where('nombre', '==', this.nombreCliente)); // Ajusta el campo 'nombre' al campo que deseas buscar
    
  //   getDocs(queryRef)
  //     .then((querySnapshot) => {
  //       this.data = querySnapshot.docs.map((doc) => {
  //         return { ...doc.data(), id: doc.id };
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error getting documents:', error);
  //     });
  // }

  

  searchClientes() {
    const usersCollectionRef = collection(this.firestore, 'users');
    const queryRef = query(
      usersCollectionRef,
      where('nombre', '>=', this.nombreCliente.toLowerCase()),
      where('nombre', '<=', this.nombreCliente.toLowerCase() + '\uf8ff')
    );
  
    getDocs(queryRef)
      .then((querySnapshot) => {
        const data: { id: string; nombre: string }[] = querySnapshot.docs.map((doc) => {
          return { ...doc.data(), id: doc.id };
        });
  
        const filteredData = data.filter(
          (item) => item.nombre.toLowerCase().includes(this.nombreCliente.toLowerCase())
        );
  
        if (filteredData.length > 0) {
          this.data = filteredData;
          this.noResultsFound = false;
        } else {
          this.data = [];
          this.noResultsFound = true;
        }
      })
      .catch((error) => {
        console.error('Error getting documents:', error);
      });
  }
  

  
  

  // searchClientes() {
  //   const searchTermNombre = this.nombreCliente.toLowerCase(); // Convertir el término de búsqueda del nombre a minúsculas
  //   const searchTermApellido = this.apellidoCliente.toLowerCase(); // Convertir el término de búsqueda del apellido a minúsculas
  
  //   const usersCollectionRef = collection(this.firestore, 'users');
  //   const queryRefNombre = query(usersCollectionRef, where('nombre', '>=', searchTermNombre), where('nombre', '<=', searchTermNombre + '\uf8ff')); // Búsqueda por nombre
  //   const queryRefApellido = query(usersCollectionRef, where('apellido', '>=', searchTermApellido), where('apellido', '<=', searchTermApellido + '\uf8ff')); // Búsqueda por apellido
  
  //   Promise.all([getDocs(queryRefNombre), getDocs(queryRefApellido)])
  //     .then(([querySnapshotNombre, querySnapshotApellido]) => {
  //       const dataNombre = querySnapshotNombre.docs.map((doc) => {
  //         return { ...doc.data(), id: doc.id };
  //       });
  
  //       const dataApellido = querySnapshotApellido.docs.map((doc) => {
  //         return { ...doc.data(), id: doc.id };
  //       });
  
  //       // Combina los resultados de las dos consultas en un solo conjunto de datos
  //       this.data = [...dataNombre, ...dataApellido];
  //     })
  //     .catch((error) => {
  //       console.error('Error getting documents:', error);
  //     });
  // }
  
  
  

  //Obtiene los datos de los clientes para el modal y para la tabla

  obtenerIdCliente(idUsers: string, nombreCliente: string, apellidoCliente: string, telefonoCliente: string, emailCliente: string) {
    this.idUsers = idUsers;
    this.nombreCliente = nombreCliente;
    this.apellidoCliente = apellidoCliente;
    this.telefonoCliente = telefonoCliente;
    this.emailCliente = emailCliente;
    

  }




  // editar con modal

  async editarCliente(nombre: string, apellido: string, telefono: string) {
    try{
      const serviceDocRef = doc(this.firestore, `users/${this.idUsers}`);

      setDoc(serviceDocRef, {nombre, apellido, telefono});
      return true;
    } catch (error) {
      console.log('Error al intentar editar el cliente:', error);
      return false;
    }   
  }

  
  async handleEditCliente(formValue: any) {    
    const nombre = formValue['nombre-edit'];
    const apellido = formValue['apellido-edit'];
    const telefono = formValue['telefono-edit'];
    try{
      await this.editarCliente(nombre, apellido, telefono);
      alert('cliente actualizado correctamente')
      this.getData();
    }catch(error){
      console.log('Error al intentar actualizar el cliente:', error);
      alert('Error al intentar actualizar el cliente');
    }
  }

  // modal para buscar la citas del cliente 
 
  







}

  





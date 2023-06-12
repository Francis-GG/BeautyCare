import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, getDocs, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public auth: Auth, private firestore: Firestore) { }

  createUser(value: any): Promise<any> {
    return createUserWithEmailAndPassword(this.auth, value.email, value.password);
  }

  loginUser(value: any): Promise<any> {
    return signInWithEmailAndPassword(this.auth, value.email, value.password);
  }

  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      const loggedIn = !!this.auth.currentUser;
      subscriber.next(loggedIn);
      subscriber.complete();
    });
  }
  

  registerUserData(nombre: string, apellido: string, telefono: string, email: string) {
    // Your registerUserData logic here
    try {
      const user = this.auth.currentUser; 
      const userDocRef = doc(this.firestore, `users/${user?.uid}`);
      setDoc(userDocRef, {nombre, apellido, telefono, email});
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}

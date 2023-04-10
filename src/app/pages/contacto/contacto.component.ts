 /// <reference types="google.maps" />
import {addDoc, Firestore, collection, getDocs} from '@angular/fire/firestore';
import { getStorage, ref } from '@angular/fire/storage';
import { AfterViewInit, Component } from '@angular/core';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements AfterViewInit {
  public data: any = [];
  constructor(public firestore: Firestore) {
    this.getData()
  }

  ngAfterViewInit(): void {
    initMap();
  }
  
  getData(){
    const dbInstance = collection(this.firestore, 'contacto');
    getDocs(dbInstance)
    .then((response) => {
      this.data = [...response.docs.map((item) => {
        return {...item.data(), id: item.id};
      })]
    })
  }
}

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

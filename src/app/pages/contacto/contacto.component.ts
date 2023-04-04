 /// <reference types="google.maps" />

import { Component } from '@angular/core';


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent {

}
/*

let map;
async function initMap(): Promise<void> {
  const position = { lat: -33.40838567608921, lng: -70.56459463109759};
  const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { Marker } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  map = new Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 10,
      center: position,
      mapId: 'a5b0b2c5c0b2b2c'
    }
  );

  const marker = new Marker({
    map: map,
    position: position,
    title: "Apoquindo 6415"
  });
}

initMap();

*/

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent {

selected!: Date | null;
minDate!: Date;
maxDate!: Date;


myFilter = (d: Date | null): boolean => {
  if (d === null) {
    return false;
  }
  const day = d.getDay();
  return day !== 0;
};

get selectedDate(): Date | null {
  return this.selected;
}

set selectedDate(date: Date | null) {
  this.selected = date;
  if (date) {
    console.log('Fecha seleccionada:', this.selectedDate);
    console.log('Obteniendo datos de fecha:', date);
  }
}


ngOnInit() {
  // Le da formato de fecha con palabras al calendario
  this.minDate = new Date();
  this.selectedDate = this.minDate;
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  this.maxDate = maxDate;
}

}

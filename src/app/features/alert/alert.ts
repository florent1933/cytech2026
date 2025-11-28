import { Component } from '@angular/core';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.html',
  styleUrl: './alert.scss',
})
export class Alert {
  alertClickedNumber = 0;

  public alert(): void {
    window.alert('Alerte déclenchée !');
    this.alertClickedNumber++;
  }

  public isOdd(num: number): boolean {
    return num % 2 !== 0;
  }
}

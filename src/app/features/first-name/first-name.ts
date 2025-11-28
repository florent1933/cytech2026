import { Component } from '@angular/core';

@Component({
  selector: 'app-first-name',
  imports: [],
  templateUrl: './first-name.html',
  styleUrl: './first-name.scss',
})
export class FirstName {
  firstName = 'Angular';

  firstNameAvailables = ['Angular', 'React', 'Vue', 'Svelte'];
  public changeFirstName(newName: string): void {
    this.firstName = newName;
  }
}

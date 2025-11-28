import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Alert } from './features/alert/alert';
import { FirstName } from './features/first-name/first-name';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alert, FirstName],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('project 123');
}

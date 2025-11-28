import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Alert } from './features/alert/alert';
import { FirstName } from './features/first-name/first-name';
import { RxContainer } from './rx/rx-container/rx-container';
import { Container } from './yoloGame/container/container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Alert, FirstName, Container, RxContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('project 123');

  availableNames = ['PureCss', 'Angular', 'React', 'Vue', 'Svelte'];

  onalertclicked(number: number): void {
    console.log(`Alert clicked ${number} times`);
  }
}

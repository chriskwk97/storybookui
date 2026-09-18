import { Component } from '@angular/core';
import { CityPageShell } from '@org/ui';
import { ButtonsShowcase } from './pages/buttons-showcase/buttons-showcase';
import { FormlyShowcase } from './pages/formly-showcase/formly-showcase';
import { FormShowcase } from './pages/form-showcase/form-showcase';

@Component({
  imports: [CityPageShell, ButtonsShowcase, FormShowcase, FormlyShowcase],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'ui-remote';
}

import { Component } from '@angular/core';
import { CityButton } from '@org/ui';

@Component({
  selector: 'app-buttons-showcase',
  standalone: true,
  imports: [CityButton],
  templateUrl: './buttons-showcase.html',
  styleUrl: './buttons-showcase.scss',
})
export class ButtonsShowcase {
  protected readonly variants = ['primary', 'secondary', 'destructive'] as const;
  protected readonly sizes = ['sm', 'md', 'lg'] as const;
}

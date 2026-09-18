import { Component, inject } from '@angular/core';
import { CityButton } from '@org/ui';
import { ClosedownService } from './closedown.service';

@Component({
  selector: 'app-closedown',
  standalone: true,
  imports: [CityButton],
  templateUrl: './closedown.html',
  styleUrl: './closedown.scss',
})
export class Closedown {
  protected readonly closedownService = inject(ClosedownService);

  onConfirm(): void {
    this.closedownService.confirmClosedown();
  }
}

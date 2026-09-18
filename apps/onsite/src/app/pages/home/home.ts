import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { from } from 'rxjs';
import { Device } from '@capacitor/device';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // RxJS bridges the one-shot Capacitor call; the Signal is what the
  // template reads. Runs via Capacitor's web fallback in the browser —
  // no native build needed to verify it works.
  protected readonly deviceInfo = toSignal(from(Device.getInfo()));
}

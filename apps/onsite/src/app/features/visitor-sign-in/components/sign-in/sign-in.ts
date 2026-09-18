import { Component, inject } from '@angular/core';
import { CityButton } from '@org/ui';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CityButton],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  protected readonly jobService = inject(JobService);

  onSignIn(): void {
    this.jobService.startJob();
  }
}

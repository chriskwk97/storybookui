import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CityButton } from '@org/ui';

@Component({
  selector: 'app-reason-for-visit-add-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, CityButton],
  templateUrl: './reason-for-visit-add-dialog.html',
  styleUrl: './reason-for-visit-add-dialog.scss',
})
export class ReasonForVisitAddDialog {
  private readonly dialogRef = inject(MatDialogRef<ReasonForVisitAddDialog, string | undefined>);

  protected readonly description = signal('');

  protected save(): void {
    this.dialogRef.close(this.description());
  }

  protected cancel(): void {
    this.dialogRef.close();
  }
}

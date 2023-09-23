import {Component} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-clock',
  templateUrl: './clock.component.html',
  styleUrls: ['./clock.component.scss']
})
export class ClockComponent {
  ClockHz: number = this._storageService.ClockHz;
  newValue: number = 0;

  constructor(private _storageService: StorageService) {
  }

  handleClockHzChange(newValue: string): void {
    this.newValue = parseInt(newValue);
  }

  handleClockHzSelect() {
    if (this.newValue < 0) this.newValue = 0;
    if (this.newValue > 1000) this.newValue = 1000;
    if (!this.newValue) this.newValue = 0;

    this.ClockHz = this.newValue;
    this._storageService.ClockHz = this.ClockHz;
  }
}

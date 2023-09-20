import {Component} from '@angular/core';
import {StorageService} from '../storage.service';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  instructions: Map<string, string>;

  constructor(private storageService: StorageService) {
    this.instructions = this.storageService.instructions;
  }

  updateInstructionValue(key: string, newValue: string) {
    this.storageService.instructions.set(key, newValue);
    console.log(this.storageService.instructions);
    console.log(this.storageService.ram);
  }

  trackByFn(index: number, item: any) {
    return item.key;
  }
}

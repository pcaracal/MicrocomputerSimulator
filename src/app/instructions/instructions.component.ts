import {Component} from '@angular/core';
import {StorageService} from '../storage.service';
import {CompilerService} from "../compiler.service";

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  instructions: Map<string, string>;

  constructor(private _storageService: StorageService, private _compilerService: CompilerService) {
    this.instructions = this._storageService.instructions;
  }

  updateInstructionValue(key: string, newValue: string) {
    this._storageService.instructions.set(key, newValue);
  }

  trackByFn(index: number, item: any) {
    return item.key;
  }

  handleClickCompile(event: MouseEvent) {
    event.preventDefault();
    this._compilerService.compileInstructions();
  }
}

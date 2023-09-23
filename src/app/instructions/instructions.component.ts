import {Component} from '@angular/core';
import {StorageService} from '../storage.service';
import {CompilerService} from "../compiler.service";
import {BaseConverter} from "../baseconverter";

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent {
  instructions: Map<number, string>;
  indices: Map<number, number> = new Map<number, number>();

  constructor(private _storageService: StorageService, private _compilerService: CompilerService) {
    this.instructions = this._storageService.instructions;

    this.instructions.forEach((value, key) => {
      this.indices.set(key, key);
    });
  }

  updateInstructionValue(key: number, newValue: string) {
    this._storageService.instructions.set(key, newValue);
    this.updateIndices();
  }

  updateIndices() { // Updates the mem addr at instructions list so stuff like jmp is much easier to write for the user
    let newIndices: Map<number, number> = new Map<number, number>();
    let i = 0;
    this.instructions.forEach((value, key) => {
      if (value.includes("#") || value.includes("[")) {
        newIndices.set(key, i);
        i++;
      } else {
        newIndices.set(key, i);
      }
      i++;
    });
    this.indices = newIndices;
  }

  trackByFn(index: number, item: any) {
    return item.key;
  }

  handleClickCompile(event: MouseEvent) {
    event.preventDefault();
    this._compilerService.compileInstructions();
  }

  handleClickAddInstruction(event: MouseEvent) {
    event.preventDefault();
    this._storageService.instructions.set(this._storageService.instructions.size, "NOP");
    this.updateIndices();
  }

  handleClickRemoveLastInstruction(event: MouseEvent) {
    event.preventDefault();
    if (this._storageService.instructions.size > this._storageService.MIN_INSTRUCTION_SIZE) this._storageService.instructions.delete(this._storageService.instructions.size - 1);
    this.updateIndices();
  }

  protected readonly BaseConverter = BaseConverter;
}

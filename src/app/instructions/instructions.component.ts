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
  pc: string = "";
  downloadString: string = "";
  isDownloadInputShown: boolean = false;
  filename: string = "";

  constructor(private _storageService: StorageService, private _compilerService: CompilerService) {
    this.instructions = this._storageService.instructions;

    this.instructions.forEach((value, key) => {
      this.indices.set(key, key);
    });

    this._storageService.PC$.subscribe(newPC => {
      this.pc = newPC;
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

  handleShowDownloadInput(event: MouseEvent) {
    event.preventDefault();
  }

  handleClickDownload(event: MouseEvent) {
    event.preventDefault();
    let downloadInstructions = new Map<number, string>();
    this.instructions.forEach((value, key) => {
      if (value == "") value = "NOP";
      downloadInstructions.set(key, value);
    });
    downloadInstructions.forEach((value, key) => {
      if (value === "") downloadInstructions.set(key, "NOP");
    });
    for (let i = downloadInstructions.size - 1; i >= 0; i--) {
      if (downloadInstructions.get(i) === "NOP") downloadInstructions.delete(i);
      else break;
    }
    this.downloadString = "";
    downloadInstructions.forEach((value, key) => {
      this.downloadString += value + "\n";
    });

    // Download handling
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.downloadString));
    element.setAttribute('download', this.filename + ".asm");
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  handleClickUpload(event: MouseEvent) {
    if (this.isDownloadInputShown) this.isDownloadInputShown = false;
    event.preventDefault();
    let element = document.createElement('input');
    element.setAttribute('type', 'file');
    element.setAttribute('accept', '.asm');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    let uploadString = "";

    element.onchange = (e) => {
      let reader = new FileReader();
      reader.onload = (e) => {
        // @ts-ignore
        uploadString = reader.result.toString();
        let lines = uploadString.split("\n");
        for (let i = 0; i < lines.length; i++) {
          if (lines[i] === "") lines[i] = "NOP";
        }
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i] === "NOP") lines.pop();
          else break;
        }

        this._storageService.instructions.clear();
        for (let i = 0; i < this._storageService.MIN_INSTRUCTION_SIZE; i++) {
          this._storageService.instructions.set(i, "NOP");
        }

        for (let i = 0; i < lines.length; i++) {
          this._storageService.instructions.set(i, lines[i]);
        }
        this.updateIndices();

      };
      // @ts-ignore
      reader.readAsText(element.files[0]);
    }
  }

  protected readonly BaseConverter = BaseConverter;
  protected readonly File = File;
}

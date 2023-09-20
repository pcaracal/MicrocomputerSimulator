import {Injectable} from '@angular/core';
import {BaseConverter} from "./baseconverter";

@Injectable({
  providedIn: 'root'
})
export class StorageService { // Handles storage of ROM, RAM, Registers, etc.
  // Memory
  instructions: Map<string, string> = new Map<string, string>(); // Instructions. User writes assembly code here, which is then converted to machine code and stored in the RAM. (Mnemonic -> Machine Code)
  ram: Map<string, string> = new Map<string, string>(); // Main storage of the computer (all in hex). The user can manually edit this.

  // Registers
  eax: number = 0;
  ebx: number = 0;
  ecx: number = 0;
  edx: number = 0;
  esp: number = 0;
  ebp: number = 0;
  esi: number = 0;
  edi: number = 0;

  // Flags
  sf: boolean = false;
  zf: boolean = false;
  of: boolean = false;
  cf: boolean = false;
  pf: boolean = false;


  constructor() {
    for (let i = 0; i < 16; i++) {
      this.instructions.set("0x" + BaseConverter.decToHex(i.toString()).toUpperCase(), "NOP");
    }

    for (let i = 0; i < 32; i++) {
      this.ram.set("0x" + BaseConverter.decToHex(i.toString()).toUpperCase(), "0");
    }
  }
}

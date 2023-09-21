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
  eax: number = 0; // 0x0 Accumulator
  ebx: number = 0; // 0x1 Base register
  ecx: number = 0; // 0x2 Counter register
  edx: number = 0; // 0x3 Data register
  esp: number = 0; // 0x4 Stack pointer
  ebp: number = 0; // 0x5 Base pointer
  esi: number = 0; // 0x6 Source index
  edi: number = 0; // 0x7 Destination index

  // Flags
  sf: boolean = false; // Sign flag
  zf: boolean = false; // Zero flag
  of: boolean = false; // Overflow flag
  cf: boolean = false; // Carry flag
  pf: boolean = false; // Parity flag


  constructor() {
    for (let i = 0; i < 16; i++) {
      this.instructions.set(BaseConverter.decToHex(i.toString()), "NOP");
    }

    for (let i = 0; i < 32; i++) {
      this.ram.set(BaseConverter.decToHex(i.toString()), BaseConverter.decToHex("0"));
    }
  }
}

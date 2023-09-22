import {Injectable} from '@angular/core';
import {BaseConverter} from "./baseconverter";

@Injectable({
  providedIn: 'root'
})
export class StorageService { // Handles storage of ROM, RAM, Registers, etc.
  // Memory
  instructions: Map<number, string> = new Map<number, string>(); // Instructions. User writes assembly code here, which is then converted to machine code and stored in the RAM. (Mnemonic -> Machine Code)
  ram: Map<string, string> = new Map<string, string>(); // Main storage of the computer (all in hex). The user can manually edit this.

  // Registers
  EAX: number = 0; // 0x0 Accumulator
  EBX: number = 0; // 0x1 Base register
  ECX: number = 0; // 0x2 Counter register
  EDX: number = 0; // 0x3 Data register
  ESP: number = 0; // 0x4 Stack pointer
  EBP: number = 0; // 0x5 Base pointer
  ESI: number = 0; // 0x6 Source index
  EDI: number = 0; // 0x7 Destination index

  // Flags
  SF: boolean = false; // Sign flag
  ZF: boolean = false; // Zero flag
  OF: boolean = false; // Overflow flag
  CF: boolean = false; // Carry flag
  PF: boolean = false; // Parity flag


  constructor() {
    for (let i = 0; i < 16; i++) {
      this.instructions.set(i, "NOP");
    }

    this.clearRam();
  }

  clearRam(): void {
    for (let i = 0; i < 32; i++) {
      this.ram.set(BaseConverter.decToHex(i.toString()), BaseConverter.anyToHex("0"));
    }
  }
}

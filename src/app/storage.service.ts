import {Injectable} from '@angular/core';
import {BaseConverter} from "./baseconverter";

@Injectable({
  providedIn: 'root'
})
export class StorageService { // Handles storage of ROM, RAM, Registers, etc.
  // Memory
  instructions: Map<number, string> = new Map<number, string>(); // Instructions. User writes assembly code here, which is then converted to machine code and stored in the RAM. (Mnemonic -> Machine Code)
  ram: Map<string, string> = new Map<string, string>(); // Main storage of the computer (all in hex). The user can manually edit this.
  registers: Map<string, string> = new Map<string, string>(); // Registers (HEX 16-bit)
  flags: Map<string, string> = new Map<string, string>(); // Flags (Binary 1-bit)

  // Registers
  // EAX: number = 0; // 0x0 Accumulator
  // EBX: number = 0; // 0x1 Base register
  // ECX: number = 0; // 0x2 Counter register
  // EDX: number = 0; // 0x3 Data register
  // ESP: number = 0; // 0x4 Stack pointer
  // EBP: number = 0; // 0x5 Base pointer
  // ESI: number = 0; // 0x6 Source index
  // EDI: number = 0; // 0x7 Destination index

  // Flags
  // SF: boolean = false; // Sign flag
  // ZF: boolean = false; // Zero flag
  // OF: boolean = false; // Overflow flag
  // CF: boolean = false; // Carry flag
  // PF: boolean = false; // Parity flag

  // Program counter
  PC: string = BaseConverter.anyToHex("0"); // Program counter - contains the address of the next instruction to be executed
  IR: string = BaseConverter.anyToHex("0"); // Instruction register - contains the current instruction being executed

  // Clock
  ClockHz: number = 0; // Clock speed in Hz (obviously)

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
    this.initRegisters();
    this.initFlags();
  }

  initRegisters(): void {
    this.registers.set("EAX", BaseConverter.anyToHex("0"));
    this.registers.set("EBX", BaseConverter.anyToHex("0"));
    this.registers.set("ECX", BaseConverter.anyToHex("0"));
    this.registers.set("EDX", BaseConverter.anyToHex("0"));
    this.registers.set("ESP", BaseConverter.anyToHex("0"));
    this.registers.set("EBP", BaseConverter.anyToHex("0"));
    this.registers.set("ESI", BaseConverter.anyToHex("0"));
    this.registers.set("EDI", BaseConverter.anyToHex("0"));
  }

  initFlags(): void {
    this.flags.set("SF", BaseConverter.anyToBin("0"));
    this.flags.set("ZF", BaseConverter.anyToBin("0"));
    this.flags.set("OF", BaseConverter.anyToBin("0"));
    this.flags.set("CF", BaseConverter.anyToBin("0"));
    this.flags.set("PF", BaseConverter.anyToBin("0"));
  }
}

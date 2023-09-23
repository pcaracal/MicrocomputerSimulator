import {Injectable} from '@angular/core';
import {BaseConverter} from "./baseconverter";
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class StorageService { // Handles storage of ROM, RAM, Registers, etc.
  readonly RAM_SIZE: number = 32;
  readonly MIN_INSTRUCTION_SIZE: number = 16;

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

  cpuState: string = "CPU Reset"; // "CPU Reset", "Instruction loaded into IR", Instruction executed", "Halted"


  // Observable string sources
  private _cpuStateSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.cpuState);
  private _PCSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.PC);
  private _IRSubject: BehaviorSubject<string> = new BehaviorSubject<string>(this.IR);
  cpuState$: Observable<string> = this._cpuStateSubject.asObservable();
  PC$: Observable<string> = this._PCSubject.asObservable();
  IR$: Observable<string> = this._IRSubject.asObservable();

  updateCpuState(newState: string): void {
    this.cpuState = newState;
    this._cpuStateSubject.next(this.cpuState);
  }

  updatePC(newPC: any): void {
    this.PC = BaseConverter.anyToHex(newPC.toString());
    this._PCSubject.next(this.PC);
  }

  updateIR(newIR: any): void {
    this.IR = BaseConverter.anyToHex(newIR.toString());
    this._IRSubject.next(this.IR);
  }

  constructor() {
    for (let i = 0; i < this.MIN_INSTRUCTION_SIZE; i++) {
      this.instructions.set(i, "NOP");
    }

    this.clearRam();
  }

  clearRam(): void {
    for (let i = 0; i < this.RAM_SIZE; i++) {
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
    this.flags.set("SF", BaseConverter.anyToDec("0"));
    this.flags.set("ZF", BaseConverter.anyToDec("0"));
    this.flags.set("OF", BaseConverter.anyToDec("0"));
    this.flags.set("CF", BaseConverter.anyToDec("0"));
    this.flags.set("PF", BaseConverter.anyToDec("0"));
  }
}

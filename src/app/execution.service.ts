import {Injectable} from '@angular/core';
import {StorageService} from "./storage.service";
import {BaseConverter} from "./baseconverter";

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {
  private _instr: string = "";
  private _src: string = "";
  private _dst: string = "";
  private _imm: string = "";

  private _srcVal: string = ""; // Value of source reg/mem/imm

  private _pc: string = ""; // Current program counter

  private _isJump: boolean = false;

  constructor(private _storageService: StorageService) {
  }

  // First 4 Bits in Hex: 0 = No operands, 1 = imm16, 2 = mem, 3 = reg (reg is encoded in the last 4 bits)


  execute(instr: string): void {
    this._instr = instr;
    this._pc = this._storageService.PC;
    console.log("Executing instruction: " + this._instr);

    switch (this._instr[2]) { // Which operands are used
      case "0": { // No operands
        this.selectNoOperands();

        this._storageService.updatePC(BaseConverter.incrementHex(this._pc));
        break;
      }

      case "1": { // imm16
        this._srcVal = this._storageService.ram.get(BaseConverter.incrementHex(this._pc)) || "";
        console.log("Imm16: " + this._srcVal)
        this.selectImm16();

        this._storageService.updatePC(parseInt(BaseConverter.anyToDec(this._pc)) + 2);
        break;
      }

      case "2": { // mem
        this._srcVal = this._storageService.ram.get(BaseConverter.incrementHex(this._pc)) || "";
        console.log("Imm16: " + this._srcVal)
        this.selectImm16();


        if (!this._isJump) this._storageService.updatePC(parseInt(BaseConverter.anyToDec(this._pc)) + 2);
        this._isJump = false;
        break;
      }

      case "3": { // reg
        this._src = this.getRegFromInstr(this._instr[5]);
        this._srcVal = this._storageService.registers.get(this._src) || "";


        this._storageService.updatePC(BaseConverter.incrementHex(this._pc));
        break;
      }

      case "F": { // only mov
        this._dst = this.getRegFromInstr(this._instr[4]);
        this._src = this.getRegFromInstr(this._instr[5]);
        this._srcVal = this._storageService.registers.get(this._src) || "";


        this._storageService.PC = (BaseConverter.incrementHex(this._pc));
        break;
      }

      default: {
        console.log("Invalid instruction");
        break;
      }
    }
  }

  // Instructions with no operands
  selectNoOperands(): void {
    switch (this._instr) {
      case "0x0000": {
        this.nop();
        break;
      }
      case "0x0001": {
        this.hlt();
        break;
      }
    }
  }

  nop(): void {
    console.log("NOP");
  }

  hlt(): void {
    this._storageService.updateCpuState("Halted");
    console.log("HLT");
  }

  getRegFromInstr(reg: string): string {
    const regs = ["EAX", "EBX", "ECX", "EDX", "ESP", "EBP", "ESI", "EDI"];
    return regs[parseInt(reg)];
  }

  // Jump instructions
  jmp(): void {
    console.log("JMP");
    this._isJump = true;
    this._storageService.updatePC(this._srcVal);
  }

  js(): void {
    console.log("JS");
    if (this._storageService.flags.get("SF") === "1") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jns(): void {
    console.log("JNS");
    if (this._storageService.flags.get("SF") === "0") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jz(): void {
    console.log("JZ");
    if (this._storageService.flags.get("ZF") === "1") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jnz(): void {
    console.log("JNZ");
    if (this._storageService.flags.get("ZF") === "0") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jo(): void {
    console.log("JO");
    if (this._storageService.flags.get("OF") === "1") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jno(): void {
    console.log("JNO");
    if (this._storageService.flags.get("OF") === "0") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jc(): void {
    console.log("JC");
    if (this._storageService.flags.get("CF") === "1") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jnc(): void {
    console.log("JNC");
    if (this._storageService.flags.get("CF") === "0") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jp(): void {
    console.log("JP");
    if (this._storageService.flags.get("PF") === "1") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  jnp(): void {
    console.log("JNP");
    if (this._storageService.flags.get("PF") === "0") {
      this._isJump = true;
      this._storageService.updatePC(this._srcVal);
    }
  }

  // Math instructions
  add(): void {
  }

  sub(): void {
  }

  mul(): void {
  }

  div(): void {
  }

  mod(): void {
  }

  cmp(): void {
  }

  and(): void {
  }

  or(): void {
  }

  xor(): void {
  }

  not(): void {
  }

  lsl(): void {
  }

  lsr(): void {
  }

  abs(): void {
  }

  neg(): void {
  }

  inc(): void {
  }

  dec(): void {
  }

  // Management instructions
  ldi(): void { // Load imm16 into eax
  }

  ldm(): void { // Load val at mem into eax
  }

  st(): void { // Store eax into mem
  }


  // Helper functions
  selectImm16(): void {
    switch (this._instr) {
      case "0x1000":
        this.add();
        break;
      case "0x1001":
        this.sub();
        break;
      case "0x1002":
        this.mul();
        break;
      case "0x1003":
        this.div();
        break;
      case "0x1004":
        this.mod();
        break;
      case "0x1005":
        this.cmp();
        break;
      case "0x1006":
        this.and();
        break;
      case "0x1007":
        this.or();
        break;
      case "0x1008":
        this.xor();
        break;
      case "0x1009":
        this.not();
        break;
      case "0x100A":
        this.lsl();
        break;
      case "0x100B":
        this.lsr();
        break;
      case "0x100C":
        this.abs();
        break;
      case "0x100D":
        this.neg();
        break;
      case "0x1010":
        this.ldi();
        break;
      case "0x2000":
        this.ldm();
        break;
      case "0x2001":
        this.st();
        break;
      case "0x2002":
        this.jmp();
        break;
      case "0x2003":
        this.js();
        break;
      case "0x2004":
        this.jns();
        break;
      case "0x2005":
        this.jz();
        break;
      case "0x2006":
        this.jnz();
        break;
      case "0x2007":
        this.jo();
        break;
      case "0x2008":
        this.jno();
        break;
      case "0x2009":
        this.jc();
        break;
      case "0x200A":
        this.jnc();
        break;
      case "0x200B":
        this.jp();
        break;
      case "0x200C":
        this.jnp();
        break;
    }
  }
}

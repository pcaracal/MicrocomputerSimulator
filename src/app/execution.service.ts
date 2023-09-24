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
  // private _imm: string = "";

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

        this.selectReg();

        this._storageService.updatePC(BaseConverter.incrementHex(this._pc));
        break;
      }

      case "F": { // only mov
        this._dst = this.getRegFromInstr(this._instr[4]);
        this._src = this.getRegFromInstr(this._instr[5]);
        this._srcVal = this._storageService.registers.get(this._src) || "";

        this.mov();

        this._storageService.updatePC(BaseConverter.incrementHex(this._pc));
        break;
      }

      default: {
        console.log("Invalid instruction");
        break;
      }
    }

    // Simulate overflow
    this._storageService.registers.forEach((value, key) => {
      let _bin = BaseConverter.anyToBin(value);
      // console.log(_bin)
      _bin = "0b" + _bin.substring(_bin.length - 16); // 16 bit + 2 for 0b
      // console.log(_bin)
      this._storageService.registers.set(key, BaseConverter.anyToHex(_bin));
    });

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
    console.log("ADD");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax + src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  sub(): void {
    console.log("SUB");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax - src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  mul(): void {
    console.log("MUL");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax * src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  div(): void {
    console.log("DIV");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));

    let result = src === 0 ? 0 : (eax / src);
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  mod(): void {
    console.log("MOD");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = src === 0 ? 0 : (eax % src);
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  cmp(): void {
    console.log("CMP");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax - src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    // CMP only sets flags
  }

  and(): void {
    console.log("AND");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax & src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  or(): void {
    console.log("OR");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax | src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  xor(): void {
    console.log("XOR");
    let eax = parseInt(BaseConverter.anyToDec(this._storageService.registers.get("EAX") || "0"));
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = eax ^ src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  not(): void {
    console.log("NOT");
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = ~src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  lsl(): void {
    console.log("LSL");
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = src << 1;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  lsr(): void {
    console.log("LSR");
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = src >> 1;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  abs(): void {
    console.log("ABS");
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = Math.abs(src);
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  neg(): void {
    console.log("NEG");
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = -src;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  inc(): void {
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = src + 1;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set(this._src, BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  dec(): void {
    let src = parseInt(BaseConverter.anyToDec(this._srcVal));
    let result = src - 1;
    this.setCFOF(result);
    this.setFlags(parseInt(BaseConverter.signedBinToDec(BaseConverter.signedDecToBin(result.toString()))));
    this._storageService.registers.set(this._src, BaseConverter.anyToHex(BaseConverter.signedDecToBin(result.toString())));
  }

  // Management instructions
  ldi(): void { // Load imm16 into eax
    console.log("LD imm16");
    this._storageService.registers.set("EAX", this._srcVal);
  }

  ldm(): void { // Load val at mem into eax
    console.log("LD mem");
    const _memaddr = this._srcVal;
    this._srcVal = this._storageService.ram.get(_memaddr) || "0";
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(this._srcVal));
  }

  st(): void { // Store eax into mem
    console.log("ST mem");
    const _memaddr = this._srcVal;
    this._storageService.ram.set(BaseConverter.anyToHex(_memaddr), this._storageService.registers.get("EAX") || BaseConverter.anyToHex("0"));
  }

  ldr(): void { // Load value from mem addr (src reg) into eax
    console.log("LDR");
    const _memaddr = this._srcVal;
    const _ldval = this._storageService.ram.get(_memaddr) || "0";
    this._storageService.registers.set("EAX", BaseConverter.anyToHex(_ldval));
  }

  str(): void { // Store eax into mem addr (dst reg)
    console.log("STR");
    const _memaddr = this._srcVal;
    const _stval = this._storageService.registers.get("EAX") || "0";
    this._storageService.ram.set(_memaddr, BaseConverter.anyToHex(_stval));
  }

  mov(): void {
    console.log("MOV");
    this._storageService.registers.set(this._dst, this._srcVal);
  }

  setCFOF(result: number): void {
    if (result > 65535) {
      this._storageService.flags.set("OF", "1");
      this._storageService.flags.set("CF", "1");
    } else {
      this._storageService.flags.set("OF", "0");
      this._storageService.flags.set("CF", "0");
    }
  }

  // Helper functions
  setFlags(result: number): void {
    const binRes = BaseConverter.decToBin(result.toString()).substring(2);
    if (result < 0) {
      this._storageService.flags.set("SF", "1");
    } else {
      this._storageService.flags.set("SF", "0");
    }

    if (result === 0) {
      this._storageService.flags.set("ZF", "1");
    } else {
      this._storageService.flags.set("ZF", "0");
    }

    // Won't work here
    // if (result > 65535) {
    //   this._storageService.flags.set("OF", "1");
    // } else {
    //   this._storageService.flags.set("OF", "0");
    // }
    //
    // if (result > 65535) {
    //   this._storageService.flags.set("CF", "1");
    // } else {
    //   this._storageService.flags.set("CF", "0");
    // }

    const resultBin = BaseConverter.decToBin(result.toString()).substring(2);
    if (resultBin.split("1").length % 2 === 0 && result != 0) {
      this._storageService.flags.set("PF", "1");
    } else {
      this._storageService.flags.set("PF", "0");
    }
  }


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
      case "0x100E":
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

  selectReg(): void {
    switch (this._instr.substring(0, 5)) {
      case "0x300":
        this.add();
        break;
      case "0x301":
        this.sub();
        break;
      case "0x302":
        this.mul();
        break;
      case "0x303":
        this.div();
        break;
      case "0x304":
        this.mod();
        break;
      case "0x305":
        this.cmp();
        break;
      case "0x306":
        this.and();
        break;
      case "0x307":
        this.or();
        break;
      case "0x308":
        this.xor();
        break;
      case "0x309":
        this.not();
        break;
      case "0x30A":
        this.lsl();
        break;
      case "0x30B":
        this.lsr();
        break;
      case "0x30C":
        this.abs();
        break;
      case "0x30D":
        this.neg();
        break;
      case "0x30E":
        this.inc();
        break;
      case "0x30F":
        this.dec();
        break;
      case "0x310" :
        this.ldr();
        break;
      case "0x311" :
        this.str();
    }
  }
}

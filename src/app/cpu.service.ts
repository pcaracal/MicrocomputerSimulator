import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CpuService {
  instructionsImm: Map<string, string> = new Map<string, string>(); // Instruction set (Mnemonic -> Machine Code (HEX 16-bit). Rightmost 4 bits is for the register, and the rest is for the opcode.)
  instructionsReg: Map<string, string> = new Map<string, string>(); // Instruction set (Mnemonic -> Machine Code (HEX 16-bit). Rightmost 4 bits is for the register, and the rest is for the opcode.)
  instructionsMem: Map<string, string> = new Map<string, string>(); // Instruction set (Mnemonic -> Machine Code (HEX 16-bit). Rightmost 4 bits is for the register, and the rest is for the opcode.)
  registers: Map<string, string> = new Map<string, string>(); // Registers (HEX 4-bit)

  constructor() {
    this.createRegisterMap();
    this.createInstructionMap();
  }

  createRegisterMap(): void {
    this.registers.set("eax", "0x0");
    this.registers.set("ebx", "0x1");
    this.registers.set("ecx", "0x2");
    this.registers.set("edx", "0x3");
    this.registers.set("esp", "0x4");
    this.registers.set("ebp", "0x5");
    this.registers.set("esi", "0x6");
    this.registers.set("edi", "0x7");
  }

  createInstructionMap(): void {
    // Math (src reg & imm16): ADD, SUB, MUL, DIV, MOD, CMP, AND, OR, XOR, NOT, LSL, LSR, ABS, NEG, INC, DEC
    // Memory: LD imm16, LD mem, ST mem
    // Control flow (mem): JMP, JS, JNS, JZ, JNZ, JO, JNO, JC, JNC, JP, JNP, NOP, MOV, HLT

    // No operands
    this.instructionsImm.set("NOP", "0x0000");  // NOP
    this.instructionsImm.set("HLT", "0x0001");  // HLT

    // With immediate
    this.instructionsImm.set("ADD", "0x1000"); // ADD imm16
    this.instructionsImm.set("SUB", "0x1001"); // SUB imm16
    this.instructionsImm.set("MUL", "0x1002"); // MUL imm16
    this.instructionsImm.set("DIV", "0x1003"); // DIV imm16
    this.instructionsImm.set("MOD", "0x1004"); // MOD imm16
    this.instructionsImm.set("CMP", "0x1005"); // CMP imm16
    this.instructionsImm.set("AND", "0x1006"); // AND imm16
    this.instructionsImm.set("OR", "0x1007");  // OR imm16
    this.instructionsImm.set("XOR", "0x1008"); // XOR imm16
    this.instructionsImm.set("NOT", "0x1009"); // NOT imm16
    this.instructionsImm.set("LSL", "0x100A"); // LSL imm16
    this.instructionsImm.set("LSR", "0x100B"); // LSR imm16
    this.instructionsImm.set("ABS", "0x100C"); // ABS imm16
    this.instructionsImm.set("NEG", "0x100D"); // NEG imm16
    this.instructionsImm.set("INC", "0x100E"); // INC imm16
    this.instructionsImm.set("DEC", "0x100F"); // DEC imm16
    this.instructionsImm.set("LD", "0x1010");  // LD imm16

    // With memory
    this.instructionsMem.set("LD", "0x2000");  // LD mem
    this.instructionsMem.set("ST", "0x2001");  // ST mem

    this.instructionsMem.set("JMP", "0x2002"); // JMP mem
    this.instructionsMem.set("JS", "0x2003");  // JS mem
    this.instructionsMem.set("JNS", "0x2004"); // JNS mem
    this.instructionsMem.set("JZ", "0x2005");  // JZ mem
    this.instructionsMem.set("JNZ", "0x2006"); // JNZ mem
    this.instructionsMem.set("JO", "0x2007");  // JO mem
    this.instructionsMem.set("JNO", "0x2008"); // JNO mem
    this.instructionsMem.set("JC", "0x2009");  // JC mem
    this.instructionsMem.set("JNC", "0x200A"); // JNC mem
    this.instructionsMem.set("JP", "0x200B");  // JP mem
    this.instructionsMem.set("JNP", "0x200C"); // JNP mem

    // With register
    this.instructionsReg.set("ADD", "0x300");  // ADD <src>
    this.instructionsReg.set("SUB", "0x301");  // SUB <src>
    this.instructionsReg.set("MUL", "0x302");  // MUL <src>
    this.instructionsReg.set("DIV", "0x303");  // DIV <src>
    this.instructionsReg.set("MOD", "0x304");  // MOD <src>
    this.instructionsReg.set("CMP", "0x305");  // CMP <src>
    this.instructionsReg.set("AND", "0x306");  // AND <src>
    this.instructionsReg.set("OR", "0x307");   // OR <src>
    this.instructionsReg.set("XOR", "0x308");  // XOR <src>
    this.instructionsReg.set("NOT", "0x309");  // NOT <src>
    this.instructionsReg.set("LSL", "0x30A");  // LSL <src>
    this.instructionsReg.set("LSR", "0x30B");  // LSR <src>
    this.instructionsReg.set("ABS", "0x30C");  // ABS <src>
    this.instructionsReg.set("NEG", "0x30D");  // NEG <src>
    this.instructionsReg.set("INC", "0x30E");  // INC <src>
    this.instructionsReg.set("DEC", "0x30F");  // DEC <src>

    // MOV gets special treatment because it has two registers
    this.instructionsReg.set("MOV", "0xF0");   // MOV <dst>, <src>
  }

  getMachineCodeFromMnemonic(mnemonic: string): any {
    mnemonic = mnemonic.toUpperCase().trim().replace(",", " ").replace("  ", " ");
    let mnemonicArr = mnemonic.split(" ");
    let instruction = mnemonicArr[0];
    let operand = mnemonicArr[1];
    let operand2 = mnemonicArr[2];

    if (operand && operand2) { // MOV <dst>, <src>
      if (this.registers.has(operand) && this.registers.has(operand2)) {
        // @ts-ignore
        return this.instructionsReg.get("MOV") + this.registers.get(operand) + this.registers.get(operand2);
      }
    }

  }
}

import {Injectable} from '@angular/core';
import {CpuService} from "./cpu.service";
import {StorageService} from "./storage.service";
import {BaseConverter} from "./baseconverter";

@Injectable({
  providedIn: 'root'
})
export class CompilerService {
  private _ramIndex: number = 0;

  constructor(private _cpuService: CpuService, private _storageService: StorageService) {
  }

  compileInstructions(): void {
    this._ramIndex = 0;
    this._storageService.clearRam();
    this._storageService.instructions.forEach((value, key) => {
      this.getMachineCodeFromMnemonic(value);
    });
  }


  getMachineCodeFromMnemonic(mnemonic: string): void {
    mnemonic = mnemonic.toUpperCase().trim().replaceAll(",", "").replaceAll("  ", " ");
    let mnemonicArr = mnemonic.split(" ");
    let instruction = mnemonicArr[0];
    const operand = mnemonicArr[1];
    const operand2 = mnemonicArr[2];

    if (instruction === "") {
      instruction = "NOP";
    }

    if (instruction === "NOP" || instruction === "HLT") { // The 2 cases where there are no operands
      // @ts-ignore
      const machineCode = this._cpuService.instructionsImm.get(instruction);

      if (machineCode) {
        this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), machineCode);
        this._ramIndex++;
        return;
      }
    }

    if (operand && operand2) { // Only MOV
      if (this._cpuService.registers.has(operand) && this._cpuService.registers.has(operand2) && this._cpuService.instructionsReg.get(instruction) && instruction === "MOV") {
        // @ts-ignore
        const machineCode = this._cpuService.instructionsReg.get(instruction) + this._cpuService.registers.get(operand) + this._cpuService.registers.get(operand2);

        if (machineCode) {
          this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), machineCode);
          this._ramIndex++;
          return;
        }
      }
    }

    if (operand && operand.at(0) != "[" && operand.at(0) != "#" && !operand2) { // Has operand, is NOT mem, is NOT imm16 - basically the instructionsReg set/map/whatever
      if (this._cpuService.registers.has(operand) && this._cpuService.instructionsReg.get(instruction)) {
        // @ts-ignore
        const machineCode = this._cpuService.instructionsReg.get(instruction) + this._cpuService.registers.get(operand);

        if (machineCode) {
          this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), machineCode);
          this._ramIndex++;
          return;
        }
      }
    }

    if (operand && operand.at(0) === "[" && !operand2) { // Has operand, is mem
      // @ts-ignore
      const machineCode = this._cpuService.instructionsMem.get(instruction);
      const address = operand.substring(1, operand.length - 1);

      if (machineCode) {
        // Machine code goes into ramIndex, address goes into ramIndex + 1
        this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), machineCode);
        this._ramIndex++;
        this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), BaseConverter.anyToHex(address));
        this._ramIndex++;
        return;
      }
    }

    if (operand && operand.at(0) === "#" && !operand2) { // Has operand, is imm16
      // @ts-ignore
      const machineCode = this._cpuService.instructionsImm.get(instruction);
      let imm16 = operand.substring(1, operand.length); // Negative number magic
      imm16 = BaseConverter.signedDecToBin(imm16);

      if (machineCode) {
        // Machine code goes into ramIndex, imm16 goes into ramIndex + 1
        this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), machineCode);
        this._ramIndex++;
        this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), BaseConverter.anyToHex(imm16));
        this._ramIndex++;
        return;
      }
    }


    // If user is dumb and doesn't know what they're doing
    this._storageService.ram.set(BaseConverter.decToHex(this._ramIndex.toString()), "ERR");
    this._ramIndex++;
  }
}

import {Component} from '@angular/core';
import {StorageService} from "../storage.service";
import {CpuService} from "../cpu.service";

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CPUComponent {
  currentState: string = "CPU Reset"; // "CPU Reset", "Instruction loaded into IR", Instruction executed", "Halted"
  registers: Map<string, string> = this._storageService.registers;
  flags: Map<string, string> = this._storageService.flags;
  PC: string = this._storageService.PC;
  IR: string = this._storageService.IR;
  ClockHz: number = this._storageService.ClockHz;

  constructor(private _cpuService: CpuService, private _storageService: StorageService) {
  }



  trackByFn(index: number, item: any) {
    return item.key;
  }
}

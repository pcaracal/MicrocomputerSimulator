import {Component} from '@angular/core';
import {StorageService} from "../storage.service";
import {CpuService} from "../cpu.service";
import {BaseConverter} from "../baseconverter";

@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CPUComponent {
  cpuState: string = "";
  registers: Map<string, string> = this._storageService.registers;
  flags: Map<string, string> = this._storageService.flags;
  PC: string = ""
  IR: string = ""
  ClockHz: number = this._storageService.ClockHz;

  constructor(private _cpuService: CpuService, private _storageService: StorageService) {
    this._storageService.cpuState$.subscribe(newState => {
      this.cpuState = newState;
    });
    this._storageService.PC$.subscribe(newPC => {
      this.PC = newPC;
    });
    this._storageService.IR$.subscribe(newIR => {
      this.IR = newIR;
    });
  }


  trackByFn(index: number, item: any) {
    return item.key;
  }

  updateRegisterValue(key: string, newValue: string) {
    this._storageService.registers.set(key, BaseConverter.anyToHex(newValue));
  }

  updatePC(newValue: string) {
    this._storageService.PC = BaseConverter.anyToHex(newValue);
  }

  updateIR(newValue: string) {
    this._storageService.IR = BaseConverter.anyToHex(newValue);
  }

  handleClickStep(event: MouseEvent) {
    event.preventDefault();
    this._cpuService.step();
  }

  handleClickRun(event: MouseEvent) {
    event.preventDefault();
    this._cpuService.run();
  }

  handleClickHalt(event: MouseEvent) {
    event.preventDefault();
    this._cpuService.halt();
  }

  handleClickReset(event: MouseEvent) {
    event.preventDefault();
    this._cpuService.reset();
  }
}

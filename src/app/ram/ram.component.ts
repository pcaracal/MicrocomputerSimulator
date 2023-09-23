import {Component} from '@angular/core';
import {StorageService} from "../storage.service";
import {BaseConverter} from "../baseconverter";

@Component({
  selector: 'app-ram',
  templateUrl: './ram.component.html',
  styleUrls: ['./ram.component.scss']
})
export class RamComponent {
  ram: Map<string, string>;
  PC: string = "";

  viewOptions = ['hex', 'bin', 'dec'];
  selectedViewOption = 'hex';

  constructor(private _storageService: StorageService) {
    this.ram = this._storageService.ram;
    this._storageService.PC$.subscribe(newPC => {
      this.PC = newPC;
    });
  }

  updateRamValueHex(key: string, newValue: string) {
    this._storageService.ram.set(key, newValue);
  }

  trackByFn(index: number, item: any) {
    return item.key;
  }

  protected readonly BaseConverter = BaseConverter;
}

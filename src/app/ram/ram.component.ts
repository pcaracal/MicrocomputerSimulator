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

  constructor(private storageService: StorageService) {
    this.ram = this.storageService.ram;
  }

  updateRamValue(key: string, newValue: string) {
    this.storageService.ram.set(key, newValue);
    console.log(this.storageService.instructions);
    console.log(this.storageService.ram);
  }

  trackByFn(index: number, item: any) {
    return item.key;
  }

  protected readonly BaseConverter = BaseConverter;
}

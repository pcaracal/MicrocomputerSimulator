import {Component} from '@angular/core';
import {StorageService} from "../storage.service";
import {BaseConverter} from "../baseconverter";

@Component({
  selector: 'app-io',
  templateUrl: './io.component.html',
  styleUrls: ['./io.component.scss']
})
export class IoComponent {
  buttonIo?: string;
  buttonArr: Array<boolean> = new Array<boolean>(16).fill(false);

  ledIo?: string;
  ledArr: Array<boolean> = new Array<boolean>(16).fill(false);

  constructor(private _storageService: StorageService) {
    this._storageService.ram$.subscribe(newRam => {
      this.buttonIo = newRam.get("0xFFF0");
      if (this.buttonIo) this.buttonArr = BaseConverter.anyToBin(this.buttonIo).substring(2).split("").map((value) => value === "1");
      this.ledIo = newRam.get("0xFFF1");
      if (this.ledIo) this.ledArr = BaseConverter.anyToBin(this.ledIo).substring(2).split("").map((value) => value === "1");
    });
  }

  onButtonClick(index: number) {
    this.buttonArr[index] = !this.buttonArr[index];
    let binaryString = "0b" + this.buttonArr.map((value) => value ? "1" : "0").join("");
    let hexString = BaseConverter.anyToHex(binaryString);
    this._storageService.setRamNewValue("0xFFF0", hexString);
  }

  protected readonly BaseConverter = BaseConverter;
  protected readonly Math = Math;
}

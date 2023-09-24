import {Component} from '@angular/core';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.scss']
})
export class GuideComponent {
  isShown = false;
  showIntroduction = true;
  showUsage = true;
  showNotation = true;

  constructor() {
  }

  toggleShow() {
    this.isShown = !this.isShown;
  }

  toggleIntroduction() {
    this.showIntroduction = !this.showIntroduction;
  }

  toggleUsage() {
    this.showUsage = !this.showUsage;
  }

  toggleNotation() {
    this.showNotation = !this.showNotation;
  }
}

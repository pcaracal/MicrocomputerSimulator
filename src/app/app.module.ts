import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CPUComponent } from './cpu/cpu.component';
import { RamComponent } from './ram/ram.component';
import { ClockComponent } from './clock/clock.component';
import { IoComponent } from './io/io.component';
import { InstructionsComponent } from './instructions/instructions.component';
import {FormsModule} from "@angular/forms";
import { GuideComponent } from './guide/guide.component';

@NgModule({
  declarations: [
    AppComponent,
    CPUComponent,
    RamComponent,
    ClockComponent,
    IoComponent,
    InstructionsComponent,
    GuideComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

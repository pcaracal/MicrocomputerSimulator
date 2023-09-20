import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CPUComponent } from './cpu/cpu.component';
import { RamComponent } from './ram/ram.component';
import { RomComponent } from './rom/rom.component';
import { ClockComponent } from './clock/clock.component';
import { IoComponent } from './io/io.component';

@NgModule({
  declarations: [
    AppComponent,
    CPUComponent,
    RamComponent,
    RomComponent,
    ClockComponent,
    IoComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

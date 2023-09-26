# MicrocomputerSimulator

## Deployment

This project is deployed at https://pcaracal.github.io/MicrocomputerSimulator/

This project uses Github Actions to automatically deploy the project to Github Pages. The workflow is defined in
`.github/workflows/jekyll-gh-pages.yml`. The workflow is triggered by pushing to the `main` branch.

## Introduction

You will also find this documentation and more in the application itself, by clicking the "Guide" button at the right of the title.

This web application is a simulator for a 16-bit microcomputer.
It is based on the Von-Neumann architecture, which means that the program and the data are stored in the same
memory. The memory is divided into 16-bit words (A word is a group of 16 bits).<br>
The CPU has 8 registers and 5 flags. The registers are all general purpose registers, because this is
a simplified model. The flags are set by all ALU (Arithmetic Logic Unit) operations.

## Usage

First you have to either load a program into the instruction input list (unimplemented) or write it manually.
The list shows the memory addresses where the machine code of the instructions will be stored. The first
instruction will be stored at address 0x0000, the second at 0x0001 etc.<br>
After, you have to compile the program. This will convert the mnemonics into machine code and store it in the
memory. Then you can run the program. The program will run until it reaches the HLT instruction or the end of
the memory. You can also step through the program by clicking the step button.<br>
The program counter (PC) is a register that holds the address of the next instruction to be executed.
The instruction register (IR) is a register that holds the machine code of the instruction that is currently
being executed.<br>
If a mnemonic has an immediate operand (imm16) or a memory address operand (mem), it will be stored in the
subsequent memory address of the instruction. (Instruction goes into 0x0000, immediate operand goes into 0x0001)<br>
The instruction input list will reflect this by incrementing all subsequent addresses by 1, which increases ease
of use.<br>
If a mnemonic has a source and/or a destination register operand (src, dst), the mnemonic will be stored in the
last 4-8 bits of the machine code.

# Angular Documentation

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

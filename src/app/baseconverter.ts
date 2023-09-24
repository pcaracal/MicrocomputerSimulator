export class BaseConverter {
  public static decToHex(dec: string): string {
    let hex = parseInt(dec).toString(16);
    while (hex.length < 4) {
      hex = "0" + hex;
    }
    return "0x" + hex.toUpperCase();
  }

  public static decToBin(dec: string): string {
    let bin = parseInt(dec).toString(2);
    while (bin.length < 16) {
      bin = "0" + bin;
    }
    return "0b" + bin;
  }

  public static hexToDec(hex: string): string {
    hex = hex.substring(2);
    return parseInt(hex, 16).toString();
  }

  public static hexToBin(hex: string): string {
    hex = hex.substring(2);
    let bin = parseInt(hex, 16).toString(2);
    while (bin.length < 16) {
      bin = "0" + bin;
    }
    return "0b" + bin;
  }

  public static binToDec(bin: string): string {
    bin = bin.substring(2);
    return parseInt(bin, 2).toString();
  }

  public static binToHex(bin: string): string {
    bin = bin.substring(2);
    let hex = parseInt(bin, 2).toString(16);
    while (hex.length < 4) {
      hex = "0" + hex;
    }
    return "0x" + hex.toUpperCase();
  }

  public static anyToDec(any: string): string {
    any = any.toLowerCase();
    if (any.substring(0, 2) === "0x") {
      return this.hexToDec(any);
    } else if (any.substring(0, 2) === "0b") {
      return this.binToDec(any);
    } else {
      return any;
    }
  }

  public static anyToHex(any: string): string {
    any = any.toLowerCase();
    if (any.substring(0, 2) === "0x") {
      const prefix = "0x";
      let hex = any.substring(2);
      while (hex.length < 4) {
        hex = "0" + hex;
      }
      return prefix + hex.toUpperCase();
    } else if (any.substring(0, 2) === "0b") {
      return this.binToHex(any);
    } else {
      return this.decToHex(any);
    }
  }

  public static anyToBin(any: string): string {
    any = any.toLowerCase();
    if (any.substring(0, 2) === "0x") {
      return this.hexToBin(any);
    } else if (any.substring(0, 2) === "0b") {
      const prefix = "0b";
      let bin = any.substring(2);
      while (bin.length < 16) {
        bin = "0" + bin;
      }
      return prefix + bin;
    } else {
      return this.decToBin(any);
    }
  }

  public static incrementHex(hex: string): string {
    let dec = this.hexToDec(hex);
    dec = (parseInt(dec) + 1).toString();
    return this.decToHex(dec);
  }

  public static decrementHex(hex: string): string {
    let dec = this.hexToDec(hex);
    dec = (parseInt(dec) - 1).toString();
    return this.decToHex(dec);
  }

  public static signedDecToBin(dec: string): string { // 2's complement
    const decimal = parseInt(dec, 10);
    const binary = (decimal & 0xFFFF).toString(2);
    const padded = binary.padStart(16, "0");
    return "0b" + padded;
  }

  public static signedHexToDec(hex: string): string { // 2's complement
    const decimal = parseInt(hex, 16);
    const binary = this.signedDecToBin(decimal.toString());
    return this.signedBinToDec(binary);
  }

  public static signedBinToDec(bin: string): string { // 2's complement
    bin = bin.substring(2);
    const isNegative = bin.charAt(0) === "1";
    let decimal = parseInt(bin, 2);
    if (isNegative) {
      decimal = (decimal ^ 0xFFFF) + 1;
    }
    return isNegative ? "-" + decimal.toString() : decimal.toString();
  }

}

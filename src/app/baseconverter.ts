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
}

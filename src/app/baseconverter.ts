export class BaseConverter {
  public static decToHex(dec: string): string {
    let hex = parseInt(dec).toString(16);
    while (hex.length < 4) {
      hex = "0" + hex;
    }
    return hex;
  }

  public static decToBin(dec: string): string {
    let bin = parseInt(dec).toString(2);
    while (bin.length < 16) {
      bin = "0" + bin;
    }
    return bin;
  }

  public static hexToDec(hex: string): string {
    return parseInt(hex, 16).toString();
  }

  public static hexToBin(hex: string): string {
    let bin = parseInt(hex, 16).toString(2);
    while (bin.length < 16) {
      bin = "0" + bin;
    }
    return bin;
  }

  public static binToDec(bin: string): string {
    return parseInt(bin, 2).toString();
  }

  public static binToHex(bin: string): string {
    return parseInt(bin, 2).toString(16);
  }
}

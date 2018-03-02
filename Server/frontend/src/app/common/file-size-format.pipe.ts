import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
@Pipe({
  name: 'fileSizeFormat'
})
export class FileSizeFormatPipe implements PipeTransform {
  // In fact unit we should be get from Static Api, at the moment we set static
  private units = ['B','kB','MB','GB','TB','PB','EB','ZB','YB'];
  // In French
  // private units = ['bit', 'kilo', 'Mo', 'Go', 'To', 'bps', 'dpi'];
  public transform(bytes: number = 0, precision: number = 2 ) : string {
    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) {
      return bytes.toString();
    }
    let unit = Math.floor(Math.log(bytes) / Math.log(1024));
    let scaledValue = bytes / ( 1024 ** unit); 

    return (+scaledValue.toFixed(precision)).toLocaleString() + this.units[ unit ];
  }

}
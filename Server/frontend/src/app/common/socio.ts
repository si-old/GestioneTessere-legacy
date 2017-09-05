import { CdL } from './CdL'
import { Carriera } from './carriera'
import { Tessera } from './tessera'

export class Socio {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  cellulare: string;
  facebook: string;

  carriere: Carriera[];

  tessere: Tessera[];

  constructor(fields?: Partial<Socio>) {
    if (fields) Object.assign(this, fields);
  }

  contains(needle: string): boolean {
    return this.nome.toLowerCase().indexOf(needle) != -1 ||
      this.cognome.toLowerCase().indexOf(needle) != -1 ||
      this.email.toLowerCase().indexOf(needle) != -1 ||
      this.cellulare.toLowerCase().indexOf(needle) != -1 ||
      this.facebook.toLowerCase().indexOf(needle) != -1 ||
      (this.carriere[0].contains(needle)) || //TODO ricerca in tutte le carriere
      (this.tessere[0].contains(needle) );
  }

  compare(other: Socio, prop: string, order: string): number {
    let propertyA: any;
    let propertyB: any;


    switch (prop) {
      case 'nome':
        [propertyA, propertyB] = [this.nome, other.nome];
        break;
      case 'cognome':
        [propertyA, propertyB] = [this.cognome, other.cognome];
        break;
      case 'email':
        [propertyA, propertyB] = [this.email, other.email];
        break;
      case 'studente':
        [propertyA, propertyB] = [this.getCarrieraAttiva().studente, other.getCarrieraAttiva().studente];
        break;
      case 'matricola':
        [propertyA, propertyB] = [this.getCarrieraAttiva().studente ? this.getCarrieraAttiva().matricola : '', other.getCarrieraAttiva() ? other.getCarrieraAttiva().matricola : ''];
        break;
      case 'cdl':
        [propertyA, propertyB] = [this.getCarrieraAttiva().studente ? this.getCarrieraAttiva().corso.nome : '', other.getCarrieraAttiva().corso.nome ? other.getCarrieraAttiva().corso.nome : ''];
        break;
      case 'professione':
        [propertyA, propertyB] = [this.getCarrieraAttiva().studente ? '' : this.getCarrieraAttiva().professione, other.getCarrieraAttiva().studente ? '' : other.getCarrieraAttiva().professione];
        break;
      case 'cellulare':
        [propertyA, propertyB] = [this.cellulare, other.cellulare];
        break;
      case 'facebook':
        [propertyA, propertyB] = [this.facebook, other.facebook];
        break;
      case 'id':
        [propertyA, propertyB] = [this.id, other.id];
        break;
    }

    let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
    let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

    return (valueA < valueB ? -1 : 1) * (order == 'asc' ? 1 : -1);
  }

  getCarrieraAttiva(): Carriera{
    return this.carriere[0];
  }

  getTessera(): Tessera{
    return this.tessere[0];
  }
}

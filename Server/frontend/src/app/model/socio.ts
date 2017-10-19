import { Comparable, Searchable } from '../common'

import { Corso } from './corso'
import { Carriera } from './carriera'
import { Tessera } from './tessera'

export class Socio implements Comparable<Socio>, Searchable{
  id: number;
  nome: string;
  cognome: string;
  email: string;
  cellulare: string;
  facebook: string;

  carriere: Carriera[];

  tessere: Tessera[];

  constructor(fields?: Partial<Socio>) {
    if (fields) {
      Object.assign(this, fields);
      if (fields.carriere) {
        this.carriere = [];
        fields.carriere.forEach(
          (c) => { this.carriere.push(new Carriera(c)) }
        )
      }
      if (fields.tessere) {
        this.tessere = [];
        fields.tessere.forEach(
          (t) => { this.tessere.push(new Tessera(t)) }
        )
      }
    }
  }

  contains(needle: string): boolean {
    return (this.nome && this.nome.toLowerCase().indexOf(needle) != -1) ||
      (this.cognome && this.cognome.toLowerCase().indexOf(needle) != -1) ||
      (this.email && this.email.toLowerCase().indexOf(needle) != -1) ||
      (this.cellulare && this.cellulare.toLowerCase().indexOf(needle) != -1) ||
      (this.facebook && this.facebook.toLowerCase().indexOf(needle) != -1) ||
      (this.carriere[0] && this.carriere[0].contains(needle)) ||
      (this.tessere[0] && this.tessere[0].contains(needle));
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

  getCarrieraAttiva(): Carriera {
    return this.carriere[0];
  }

  getTessera(): Tessera {
    return this.tessere[0];
  }

  clone(): Socio {
    let toReturn = new Socio();
    toReturn.id = this.id;
    toReturn.nome = this.nome;
    toReturn.cognome = this.cognome;
    toReturn.email = this.email;
    toReturn.cellulare = this.cellulare;
    toReturn.facebook = this.facebook;
    toReturn.carriere = [];
    this.carriere.forEach(
      (carr: Carriera) => { toReturn.carriere.push(carr.clone()) }
    );
    toReturn.tessere = [];
    this.tessere.forEach(
      (tess: Tessera) => { toReturn.tessere.push(tess.clone()) }
    );
    return toReturn;
  }

  reinit(input: Socio) {
    if (this === input) { //protect against aliasing
      return
    }
    this.id = input.id;
    this.nome = input.nome;
    this.cognome = input.cognome;
    this.email = input.email;
    this.facebook = input.facebook;
    this.cellulare = input.cellulare;
    this.carriere.length = 0 //clear without changing reference to not break observers
    input.carriere.forEach(
      (carr: Carriera) => { this.carriere.push(carr.clone()) }
    );
    this.tessere.length = 0;
    input.tessere.forEach(
      (tess: Tessera) => { this.tessere.push(tess.clone()) }
    );
  }
}

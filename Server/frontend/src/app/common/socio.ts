import { CdL } from './CdL'

export class Socio{
  id: number;
  nome: string;
  cognome: string;
  email: string;
  cellulare: string;
  facebook: string;
  studente: boolean;

  professione ?: string;

  matricola ?: string;
  cdl ?: CdL;
  
  editing: boolean = false;

  constructor(fields ?: Partial<Socio>){
                  if (fields) Object.assign(this, fields);
  }
  
  contains(needle: string): boolean{
    return this.nome.toLowerCase().indexOf(needle) != -1 ||
           this.cognome.toLowerCase().indexOf(needle) != -1 ||
           this.email.toLowerCase().indexOf(needle) != -1 ||
           this.cellulare.toLowerCase().indexOf(needle) != -1 ||
           this.facebook.toLowerCase().indexOf(needle) != -1 ||
           (!this.studente && this.professione && this.professione.toLowerCase().indexOf(needle) != -1 ) ||
           (this.studente && this.matricola && this.matricola.toLowerCase().indexOf(needle) != -1 ) ||
           (this.studente && this.cdl && this.cdl.nome.toLowerCase().indexOf(needle) != -1 )
  }

  compare(other: Socio, prop: string, order: string): number{
    let propertyA: number|boolean|string = '';
    let propertyB: number|boolean|string = '';
    

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
        [propertyA, propertyB] = [this.studente, other.studente]; 
        break;
      case 'matricola': 
        [propertyA, propertyB] = [this.studente ? this.matricola : '', other.studente? other.matricola : '']; 
        break;
      case 'cdl': 
        [propertyA, propertyB] = [this.studente ? this.cdl.nome : '', other.studente? other.cdl.nome : '']; 
        break;
      case 'professione': 
        [propertyA, propertyB] = [this.studente ? '' : this.professione, other.studente? '' : other.professione]; 
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
}

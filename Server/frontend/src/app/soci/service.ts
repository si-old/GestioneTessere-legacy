import { Injectable } from '@angular/core'
import { Socio } from '../common/socio'

const SOCI: Socio[] = [
  new Socio({
    id: 1, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare',
     studente: true, facebook: 'fb', matricola: 'matr', cdl: {
       id: 1, nome: 'CdL'
     }
  }),
  new Socio({
    id: 1, nome: 'nome', cognome: 'cognome', email: 'email', cellulare: 'cellulare',
     studente: false, facebook: 'fb', professione: 'prof'
  })
]

@Injectable()
export class SociService{
  getSoci(): Promise<Socio[]> {
    return Promise.resolve(SOCI);
  }

  updateSocio(newSocio: Socio){
    let index = SOCI.findIndex( (temp: Socio) => { return temp.id == newSocio.id } );
    if(index == -1){
      SOCI.push(newSocio);
    }else{ 
      Object.assign(SOCI[index], newSocio);
    }
  }
}

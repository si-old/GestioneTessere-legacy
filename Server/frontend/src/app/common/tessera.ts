import { Tesseramento } from './tesseramento'

export class Tessera{

    numero: string;
    anno: Tesseramento;
    attiva: boolean;

    constructor(fields?: Partial<Tessera>){
        if(fields) Object.assign(this, fields);
    }

    contains(needle: string): boolean {
        return this.numero.toLowerCase().indexOf(needle) != -1;
    }
}
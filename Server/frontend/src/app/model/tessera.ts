import { Tesseramento } from './tesseramento'

export class Tessera{
    id: number;
    
    numero: number;
    anno: Tesseramento;

    constructor(fields?: Partial<Tessera>){
        if(fields) {
            Object.assign(this, fields);
            if(fields.anno){
                this.anno = new Tesseramento(fields.anno);
            }
        }
    }

    contains(needle: string): boolean {
        return this.numero && this.numero.toString().indexOf(needle) != -1;
    }

    clone(): Tessera{
        let toReturn = new Tessera(this);
        return toReturn;
    }
}
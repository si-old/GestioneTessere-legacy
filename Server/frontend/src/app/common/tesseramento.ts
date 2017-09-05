export class Tesseramento{
    anno: string;
    attivo: boolean;

    constructor(fields?: Partial<Tesseramento>){
        if(fields) Object.assign(this, fields);
    }

    toString(): string{
        let toReturn: string = this.anno;
        if( !this.attivo ) toReturn += " (chiuso)" 
        return toReturn
    }
}
export class Tesseramento {

    id: number;

    anno: string;
    attivo: boolean;

    constructor(fields?: Partial<Tesseramento>) {
        if (fields) Object.assign(this, fields);
    }

    equals(other: Tesseramento) {
        return other && this.id == other.id;
    }

    toString(): string {
        let toReturn: string = this.anno;
        if (!this.attivo) toReturn += " (chiuso)"
        return toReturn
    }
}
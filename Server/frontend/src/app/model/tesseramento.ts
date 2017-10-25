export class Tesseramento {

    id: number;

    anno: string;
    aperto: boolean;

    tessere?: number[];

    constructor(fields?: Partial<Tesseramento>) {
        if (fields) Object.assign(this, fields);
    }

    equals(other: Tesseramento) {
        return other && this.id == other.id;
    }

    toString(): string {
        let toReturn: string = this.anno;
        if (!this.aperto) toReturn += " (chiuso)"
        return toReturn
    }
}
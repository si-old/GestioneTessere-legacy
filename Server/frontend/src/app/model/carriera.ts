import { CdL } from './CdL'

export class Carriera {
    id: number;

    studente: boolean;
    professione: string;

    matricola: string;
    corso: CdL;
    attiva: boolean;

    constructor(fields?: Partial<Carriera>) {
        if (fields) {
            Object.assign(this, fields);
            if (fields.corso) {
                this.corso = new CdL(fields.corso);
            }
        }
    }

    contains(needle: string): boolean {
        return (!this.studente && this.professione && this.professione.toLowerCase().indexOf(needle) != -1) ||
            (this.studente && this.corso.contains(needle)) ||
            (this.studente && this.matricola && this.matricola.toLowerCase().indexOf(needle) != -1);
    }

    compare(other: Carriera, prop: string, order: string): number {
        let propertyA: any;
        let propertyB: any;

        switch (prop) {
            case 'corso':
                [propertyA, propertyB] = [this.corso.nome, other.corso.nome];
                break;
            case 'matricola':
                [propertyA, propertyB] = [this.matricola, other.matricola];
                break;
        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (order == 'asc' ? 1 : -1);
    }

    clone() {
        let toReturn = new Carriera(this);
        return toReturn;
    }

    toString(): string {
        return (this.studente) ? (this.matricola + ' (' + this.corso.nome + ')') : this.professione;
    }
}
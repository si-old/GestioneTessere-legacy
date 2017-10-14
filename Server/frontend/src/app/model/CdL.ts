export class CdL {
    id: number;
    nome: string;

    constructor(fields?: Partial<CdL>) {
        if (fields) Object.assign(this, fields);
    }

    contains(needle: string): boolean {
        return this.nome && this.nome.toLowerCase().indexOf(needle) != -1;
    }

    compare(other: CdL, prop: string, order: string): number {
        let propertyA: any;
        let propertyB: any;

        if(this.hasOwnProperty(prop) && other.hasOwnProperty(prop)){
            [propertyA, propertyB] = [this[prop], other[prop]];
        }else{
            console.warn("unknown property "+ prop);
            [propertyA, propertyB] = [this.id, other.id];
        }

        switch (prop) {
            case 'nome':
                [propertyA, propertyB] = [this.nome, other.nome];
                break;
            case 'id':
                [propertyA, propertyB] = [this.id, other.id];
                break;
        }

        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (order == 'asc' ? 1 : -1);
    }

    toString(): string{
        return this.nome;
    }
}

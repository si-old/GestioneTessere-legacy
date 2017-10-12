import { Socio } from './socio'

export class MembroDirettivo extends Socio {

    id_direttivo: number;
    user: string;
    password: string;

    constructor(fields?: Partial<MembroDirettivo>) {
        super(fields);
        if (fields) Object.assign(this, fields);
    }

    contains(needle: string): boolean {
        return (super.contains(needle) && this.user.toLowerCase().indexOf(needle) != -1);
    }

    toString(): string {
        return this.user;
    }
}
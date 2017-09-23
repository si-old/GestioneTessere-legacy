import { Socio } from './socio'

export class Direttivo extends Socio {
    user: string;
    password: string;

    constructor(fields?: Partial<Direttivo>) {
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
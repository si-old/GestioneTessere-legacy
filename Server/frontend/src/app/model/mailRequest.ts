export class MailRequest {
    oggetto: string;
    corpo: string;

    email_feedback: string;
    blacklist: boolean;
    lavoratori: boolean;
    tutti: boolean;

    corsi?: number[];
    files: File[];

    constructor(fields?: Partial<MailRequest>) {
        if (fields) {
            Object.assign(this, fields);
            if (fields.corsi) {
                this.corsi = [];
                fields.corsi.forEach((corso) => { this.corsi.push(corso) });
            }
            if (fields.files) {
                this.files = [];
                fields.files.forEach((file) => { this.files.push(file) });
            }
        }
    }

    clone() {
        return new MailRequest(this);
    }
}
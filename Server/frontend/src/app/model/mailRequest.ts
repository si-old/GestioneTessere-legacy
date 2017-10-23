export class MailRequest{
    oggetto: string;
    corpo: string;

    email_feedback: string;
    blacklist: boolean;
    lavoratori: boolean;
    tutti: boolean;

    corsi?: number[];
}
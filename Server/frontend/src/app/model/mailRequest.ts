export class MailRequest{
    oggetto: string;
    corpo: string;

    email_feedback: string;
    blacklist: boolean;
    tutti: boolean;

    lavoratori?: boolean;
    corsi?: number[];
}
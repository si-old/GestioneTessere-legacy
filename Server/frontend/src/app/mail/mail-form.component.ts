import { Component, OnInit } from '@angular/core'

import { CorsiService } from '../corsi/main.service'

import { Corso } from '../model'

@Component({
    selector: 'mail-form',
    templateUrl: './mail-form.component.html',
    styleUrls: ['./mail-form.component.css', '../common/style.css']
})
export class MailFormComponent implements OnInit {

    corsi: Corso[];

    oggetto: string = '';
    corpo: string = '';
    email_feedback: string = '';

    blacklist: boolean = false;
    tutti: boolean = false;

    lavoratori: boolean = false;
    lavoratori_disabled: boolean = false;

    corsi_checked: boolean[] = [];
    corsi_disabled: boolean[] = [];

    constructor(private corsisrv: CorsiService) {
    }

    ngOnInit() {
        this.corsisrv.getCorsi().subscribe(
            (in_corsi: Corso[]) => { 
                in_corsi.forEach(
                    (corso: Corso) => {
                        this.corsi_checked[corso.id] = false;
                        this.corsi_disabled[corso.id] = false;
                    }
                );
                this.corsi = in_corsi
            }
        )
    }

    tuttiCallback(){
        this.lavoratori_disabled = this.tutti;
        this.corsi_disabled.forEach(
            (val: boolean, i: number) => {
                this.corsi_disabled[i] = this.tutti;
            }
        )
    }
}
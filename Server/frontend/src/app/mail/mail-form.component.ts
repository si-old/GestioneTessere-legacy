import { Component, OnInit } from '@angular/core'

import { CorsiService } from '../corsi/main.service'
import { MailService } from './main.service'

import { MatDialog, MatDialogRef } from '@angular/material'

import { LoadingDialog, MessageDialog } from '../dialogs'

import { Corso, MailRequest, MailResponse } from '../model'

import { first } from 'rxjs/operators'

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

    corsi_checked: boolean[] = [];
    corsi_disabled: boolean[] = [];

    _numeroFile: number = 0;
    files: File[] = [];

    constructor(private corsisrv: CorsiService,
        private dialog: MatDialog,
        private mailsrv: MailService) {
    }

    ngOnInit() {
        this.corsisrv.getCorsi().pipe(first()).subscribe(
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

    tuttiCallback() {
        this.corsi_disabled.forEach(
            (val: boolean, i: number) => {
                this.corsi_disabled[i] = this.tutti;
            }
        )
    }

    sendEmail(form) {
        if (!form.invalid) {
            let mailReq: MailRequest = new MailRequest({
                oggetto: this.oggetto,
                corpo: this.corpo,
                email_feedback: this.email_feedback,
                blacklist: this.blacklist,
                lavoratori: this.lavoratori,
                tutti: this.tutti,
                files: this.files.filter((file) => file != null)
            });
            if (!this.tutti) {
                mailReq.corsi = [];
                this.corsi_checked.forEach(
                    (val: boolean, index: number) => {
                        if (val) mailReq.corsi.push(index);
                    }
                )
            }
            let loadRef: MatDialogRef<LoadingDialog>;
            loadRef = this.dialog.open(LoadingDialog, {
                disableClose: true
            });
            this.mailsrv.sendEmail(mailReq).subscribe({
                next: (res: MailResponse) => {
                    loadRef.close();
                    this.dialog.open(MessageDialog, {
                        data: {
                            message: `Su un totale di ${res.ok + res.nok} email,`
                                + ` ${res.ok} sono state inviate con successo.`
                        }
                    })
                },
                error: (err: any) => {
                    loadRef.close();
                    throw err;
                }
            });
        }
    }
}
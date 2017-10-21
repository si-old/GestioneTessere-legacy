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

    constructor(private corsisrv: CorsiService) {
    }

    ngOnInit() {
        this.corsisrv.getCorsi().subscribe(
            (in_corsi: Corso[]) => { this.corsi = in_corsi }
        )
    }
}
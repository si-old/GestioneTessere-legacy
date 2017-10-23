import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

import { MailRequest, MailResponse } from '../model'

const RPC_ENDPOINT: string = "https://www.studentingegneria.it/socisi/backend/mail.php"

@Injectable()
export class MailService{

    constructor(private http: HttpClient){

    }

    sendEmail(req: MailRequest): Observable<MailResponse>{
        return this.http.post<MailResponse>(RPC_ENDPOINT, req)
    }
}
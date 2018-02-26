import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

import { MailRequest, MailResponse } from '../model'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER} from '../common'

const RPC_ENDPOINT: string = BACKEND_SERVER + "mail.php"

@Injectable()
export class MailService{

    constructor(private http: HttpClient){

    }

    sendEmail(req: MailRequest): Observable<MailResponse>{
        let form: FormData = new FormData();
        form.append("content", JSON.stringify(req));
        return this.http.post<MailResponse>(RPC_ENDPOINT, form)
    }
}
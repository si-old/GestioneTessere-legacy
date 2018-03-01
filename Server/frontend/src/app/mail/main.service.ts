import { Injectable } from '@angular/core'

import { HttpClient } from '@angular/common/http'

import { Observable } from 'rxjs/Observable'

import { MailRequest, MailResponse } from '../model'

import { HTTP_GLOBAL_OPTIONS, BACKEND_SERVER } from '../common'

const RPC_ENDPOINT: string = BACKEND_SERVER + "mail.php"

@Injectable()
export class MailService {

    constructor(private http: HttpClient) {

    }

    sendEmail(req: MailRequest): Observable<MailResponse> {
        let form: FormData = new FormData();
        let mailContent = req.clone();
        delete mailContent.files;
        console.log(req);
        console.log(mailContent);
        form.append("content", JSON.stringify(mailContent));
        if (req.files.length > 0) {
            form.append('files', JSON.stringify(req.files.map((file, i) => 'att' + i)));
            req.files.forEach(
                (file, i) => { form.append('att' + i, file, file.name) }
            )
        }
        return this.http.post<MailResponse>(RPC_ENDPOINT, form)
    }
}
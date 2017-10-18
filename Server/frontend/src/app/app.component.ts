import { Component } from '@angular/core';
import { LoginService } from './login/main.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./common/style.css']
})
export class AppComponent {
  title = 'app';

  constructor(public _login: LoginService){
  }
}

import { NgModule } from '@angular/core'

import { RouterModule, Routes } from '@angular/router'

import { SociComponent } from './soci/main.component'
import { DirettivoComponent } from './direttivo/main.component'
import { CorsiComponent } from './corsi/main.component'
import { TesseramentiComponent } from './tesseramenti/main.component'
import { LoginComponent } from './login/main.component'
import { MainMailComponent } from './mail/main.component'
import { LogComponent } from './log/main.component'

import { LoggedinGuard, AdminGuard } from './login/main.service'

import { DettagliSocioComponent } from './soci/dettagli.component'

const routes: Routes = [
  {
    path: "direttivo",
    component: DirettivoComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "log",
    component: LogComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "corsi",
    component: CorsiComponent,
    canActivate: [LoggedinGuard]
  },
  {
    path: "tesseramenti",
    component: TesseramentiComponent,
    canActivate: [LoggedinGuard]
  },
  {
    path: "soci",
    component: SociComponent,
    canActivate: [LoggedinGuard]
  },
  {
    path: "mail",
    canActivate: [LoggedinGuard],
    children: [
      {
        path: '',
        redirectTo: 'send',
        pathMatch: 'full'
      },
      {
        path: 'send',
        component: MainMailComponent,
      },
      {
        path: 'blacklist',
        component: MainMailComponent
      }
    ]
  },
  {
    path: "login",
    component: LoginComponent
  },
  { path: "", redirectTo: "/login", pathMatch: "full" },
  { path: '**', redirectTo: "/login", pathMatch: "full" }
]

@NgModule({
  imports: [
    RouterModule.forRoot(
      routes
    ),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule{

}

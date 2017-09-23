import { NgModule } from '@angular/core'

import { RouterModule, Routes } from '@angular/router'

import { SociComponent } from './soci/main.component'
import { DirettivoComponent } from './direttivo/main.component'
import { CorsiComponent } from './corsi/main.component'
import { TesseramentiComponent } from './tesseramenti/main.component'

import { DettagliSocioComponent } from './soci/dettagli.component'

const routes: Routes = [
  {
    path: "direttivo",
    component: DirettivoComponent
  },
  {
    path: "corsi",
    component: CorsiComponent
  },
  {
    path: "tesseramenti",
    component: TesseramentiComponent
  },
  {
    path: "soci/:id",
    component: DettagliSocioComponent
  },
  {
    path: "soci",
    component: SociComponent
  },
  { path: "", redirectTo: "/soci", pathMatch: "full" },
  { path: '**', redirectTo: "/soci", pathMatch: "full" }
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

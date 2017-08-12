import { NgModule } from '@angular/core'

import { RouterModule, Routes } from '@angular/router'

import { SociComponent } from './soci/component'
import { DirettivoComponent } from './direttivo/component'
import { CorsiComponent } from './corsi/component'

const routes: Routes = [
  {
    path: "soci",
    component: SociComponent
  },
  {
    path: "direttivo",
    component: DirettivoComponent
  },
  {
    path: "corsi",
    component: CorsiComponent
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

import { Sort } from '@angular/material'

export interface TableChangeData<T>{
    data: T
    filter: string
    sort: Sort
}
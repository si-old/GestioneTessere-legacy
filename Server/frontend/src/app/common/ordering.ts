import { PaginableService }  from './pagination'

export class OrderingPaginableService extends PaginableService{
    
    orderby: string = null;
    orderasc: boolean = true;

    queryString(): string {
        let paginationQuery: string = super.queryString();
        let toReturn = "";
        if (this.orderby) {
            toReturn = "orderby=" + this.orderby + "&orderasc=" + this.orderasc;
        }
        if(paginationQuery){
            toReturn = [toReturn, paginationQuery].filter(x => x).join('&');
        }
        return toReturn;
    }
}
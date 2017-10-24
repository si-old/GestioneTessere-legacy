export class PaginatedResults<T>{
    totale: number;
    offset: number;
    limit: number;
    results: T[];
}

export class PaginableService{
    
    paginate: boolean = false;
    limit: number = 10;
    offset: number = 0;
    length: number = 0;

    get index(): number{
        return Math.floor(this.offset / this.limit);
    }
    set index(value: number){
        this.offset = value * this.limit;
    }

    get paginationQuery(): string {
        if (this.paginate) {
            return "paginate&limit=" + this.limit + "&offset=" + this.offset
        } else {
            return ""
        }
    }

    nextPage(){
        this.offset += this.limit
    }

    previousPage(){
        this.offset -= this.limit
        if(this.offset < 0) this.offset = 0;
    }
}
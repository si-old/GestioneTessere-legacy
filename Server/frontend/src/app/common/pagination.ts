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

    public get index(): number{
        return Math.floor(this.offset / this.limit);
    }
    public set index(value: number){
        this.offset = value * this.limit;
    }

    public queryString(): string {
        if (this.paginate) {
            return "paginate&limit=" + this.limit + "&offset=" + this.offset
        } else {
            return ""
        }
    }

    public nextPage(){
        this.offset += this.limit
    }

    public previousPage(){
        this.offset -= this.limit
        if(this.offset < 0) this.offset = 0;
    }
}
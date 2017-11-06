export class LoadingTracker{
    
    finishedSteps: number;

    constructor(private steps: number){
        this.finishedSteps = 0;
    }

    addStep(): void{
        this.finishedSteps++;
    }

    isLoaded(): boolean{
        return this.finishedSteps >= this.steps;
    }
}
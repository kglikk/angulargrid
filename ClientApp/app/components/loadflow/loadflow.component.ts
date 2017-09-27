import { Component, Inject } from '@angular/core';
import { Http } from "@angular/http";

//powiedz Angularowi, że to jest komponent
@Component({
    selector: 'loadflow',
    templateUrl: './loadflow.component.html'
})


export class LoadFlowComponent {
    public loadflow: LoadFlow[] = [];
    
    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
        http.get(baseUrl + 'api/LoadFlowController/LoadFlow').subscribe(result => {
            this.loadflow = result.json() as LoadFlow[];
        }, error => console.error(error));
    }

}

interface LoadFlow {
   
    busNo: number;
    resultU: number;
    resultSigma: number; 
}

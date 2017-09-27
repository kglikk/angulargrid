import { Component } from '@angular/core';
import { Http } from "@angular/http";

@Component({
    selector: 'twophasetransformers',
    templateUrl: './twophasetransformers.component.html'
})


export class TwoPhaseTransformersComponent {
    public twophasetransformer: TwoPhaseTransformers[] = [];

       constructor(http: Http) {
        
        http.get('/api/TwoPhaseTransformerController/TwoPhaseTransformer').subscribe(result => {
            this.twophasetransformer = result.json();
        });
    }

}

export interface TwoPhaseTransformers {
    ID: number;
    name: string;
    HVNodeNo: number;
    LVNodeNo: number;
    HVVoltageRated: number;
    LVVoltageRated: number;
    apparentPowerRated: number;
    loadLossesRated: number;
    shortCircuitVoltage: number;
}


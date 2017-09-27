import { Component } from '@angular/core';
import { Http } from "@angular/http";


@Component({
    selector: 'overheadlines',
    templateUrl: './overheadlines.component.html'
})

export class OverheadLinesComponent {
    public overheadline: OverheadLines[] = [];

    constructor(http: Http) {        
        http.get('/api/OverheadLineController/OverheadLine').subscribe(result => {
            this.overheadline = result.json();
        });
    }

}

export interface OverheadLines {
    ID: number;
    name: string;
    startNodeNo: number;
    endNodeNo: number;
    length: number;
    unitaryResistance: number;
    unitaryReactance: number;
    unitaryCapacitance: number;
}


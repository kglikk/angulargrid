import { Component, Inject } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { GridOptions } from "ag-grid/main";


@Component({    
    templateUrl: './loadflow.component.html'
})


export class LoadFlowComponent {
    public loadflow: LoadFlow[] = [];

    gridOptions: GridOptions;
    rowData: any[];

    
    constructor(http: Http, @Inject('BASE_URL') baseUrl: string) {
         // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit(); //make the currently visible columns fit the screen.
            },
        };

        this.gridOptions = {           
           // singleClickEdit: false,
            stopEditingWhenGridLosesFocus: true,

            enableSorting: true,
            enableFilter: true,
            enableColResize: true,
            animateRows: true,
            rowSelection: 'multiple',
            columnDefs: [
                // put the three columns into a group
                {
                    headerName: 'Load flow data',
                    children: [
                        
                        {
                            headerName: "Bus no.", field: "busNo", type: "numericColumn"                           
                        },
                        {
                            headerName: "Voltage [kV]", field: "resultU", type: "numericColumn",
                            
                        },
                        {
                            headerName: "Angle [degrees]", field: "resultSigma", type: "numericColumn",
                           
                        }
                        
                    ]
                }
            ],
            defaultColDef: {
                //enableCellChangeFlash: true,
                // set every column width
                width: 150,
                // make every column editable
                //editable: true,
                // make every column use 'text' filter by default
                filter: 'text'
            },
        }

        
        
        http.get(baseUrl + 'api/LoadFlowController/LoadFlow').subscribe(result => {
            this.rowData = result.json(); //as LoadFlow[]
        }); //, error => console.error(error)
    }

}

interface LoadFlow {
   
    busNo: number;
    resultU: number;
    resultSigma: number; 
}

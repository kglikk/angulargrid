import { Component, Inject } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { GridOptions } from "ag-grid/main";

@Component({
   
    templateUrl: './twophasetransformers.component.html'
})


export class TwoPhaseTransformersComponent {
    public twophasetransformer: TwoPhaseTransformers[] = [];

    gridOptions: GridOptions;
    rowData: any[];

    constructor(public http: Http, @Inject('BASE_URL') baseUrl: string)  {
        // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{
            onGridReady: () => {
                this.gridOptions.api.sizeColumnsToFit(); //make the currently visible columns fit the screen.
            },
        };


        this.gridOptions = {
            onCellValueChanged: function (event) {
                //jeśli zmieniona wartość jest ok 
                console.log("onCellValueChanged");
                var headers = new Headers();
                headers.append('Content-Type', 'application/json; charset=utf-8');
                http.put(baseUrl + 'api/TwoPhaseTransformer/' + event.data.id, JSON.stringify({ ID: event.data.id, Name: event.data.name, HVNodeNo: event.data.hvNodeNo, LVNodeNo: event.data.lvNodeNo, HVVoltageRated: event.data.hvVoltageRated, LVVoltageRated: event.data.lvVoltageRated, ApparentPowerRated: event.data.apparentPowerRated, LoadLossesRated: event.data.loadLossesRated, ShortCircuitVoltage: event.data.shortCircuitVoltage }), { headers: headers }).subscribe();
            },
            onCellEditingStopped: () => {
                console.log("onCellEditingStopped");
            },
            onRowDataChanged: () => {
                console.log("onRowDataChanged");
            },
            singleClickEdit: false,
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
                        { headerName: "Name", field: "name", width: 110 },
                        {
                            headerName: "High voltage node no.", field: "hvNodeNo", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Low voltage node no.", field: "lvNodeNo", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Rated high voltage [kV]", field: "hvVoltageRated", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Rated low voltage [kV]", field: "lvVoltageRated", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Rated apparent power [MVA]", field: "apparentPowerRated", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Rated load losses [kW]", field: "loadLossesRated", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Short circuit voltage [%]", field: "shortCircuitVoltage", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        }
                    ]
                }
            ],
            defaultColDef: {
                //enableCellChangeFlash: true,
                // set every column width
                width: 150,
                // make every column editable
                editable: true,
                // make every column use 'text' filter by default
                filter: 'text'
            },
        }

        //wczytaj dane z bazy danych
        this.http.get(baseUrl + 'api/TwoPhaseTransformer/Get').subscribe(result => {
            this.rowData = result.json();
        });
     
    }

    //sprawdzanie czy wprowadzona liczba do tabeli jest liczbą
    numberValueFormatter(params) {
        if (isNaN(Number(params.value))) {
            return "";
        } else {
            return params.value;
        }
    }
    //ustawienie wartości jeśli jest liczbą
    numberValueSetter(params) {
        if (isNaN(parseFloat(params.newValue)) || !isFinite(params.newValue)) {
            alert("It must be a number");
            return false; // don't set invalid numbers!
        }

        if (params.colDef.field == "hvNodeNo") {
            params.data.hvNodeNo = params.newValue;
        }
        if (params.colDef.field == "lvNodeNo") {
            params.data.lvNodeNo = params.newValue;
        }
        if (params.colDef.field == "hvVoltageRated") {
            params.data.hvVoltageRated = params.newValue;
        }
        if (params.colDef.field == "lvVoltageRated") {
            params.data.lvVoltageRated = params.newValue;
        }
        if (params.colDef.field == "apparentPowerRated") {
            params.data.apparentPowerRated = params.newValue;
        }
        if (params.colDef.field == "loadLossesRated") {
            params.data.loadLossesRated = params.newValue;
        }
        if (params.colDef.field == "shortCircuitVoltage") {
            params.data.shortCircuitVoltage = params.newValue;
        }
        return true;
        //w bazie danych SQL dane są aktualizowane w onCellValueChanged  
    }

    //zaktualizowanie tabeli
    printResult(res) {
        console.log('---------------------------------------')
        if (res.add) {
            res.add.forEach(function (rowNode) {

                console.log('Added Row Node', rowNode);
            });
        }
        if (res.remove) {
            res.remove.forEach(function (rowNode) {
                console.log('Removed Row Node', rowNode);
            });
        }
        if (res.update) {
            res.update.forEach(function (rowNode) {
                console.log('Updated Row Node', rowNode);
            });
        }
    }

    removeSelected() {

        if (window.confirm('Are you sure you want to delete?')) {
            //front-end
            var selectedData = this.gridOptions.api.getSelectedRows();

            let rowIdArray: number[] = [];
            this.gridOptions.api.forEachNode(function (node) {

                if (node.isSelected()) {
                    rowIdArray.push(node.data.id);
                }
            });

            var res = this.gridOptions.api.updateRowData({ remove: selectedData });
            this.printResult(res);
            //back-end
            var headers = new Headers();
            headers.append('Content-Type', 'application/json; charset=utf-8');
            for (var rowId = 0; rowId < rowIdArray.length; rowId++) {
                this.http.delete('api/TwoPhaseTransformer/' + rowIdArray[rowId], { headers: headers }).subscribe();
            }
        } else { }
    }

    onAddRow() {

        var newItem = {
            //id: 0,
            name: "Two phase transformer",
            hvNodeNo: 0,
            lvNodeNo: 0,
            hvVoltageRated: 0,
            lvVoltageRated: 0,
            apparentPowerRated: 0,
            loadLossesRated: 0,
            shortCircuitVoltage: 0,

        };
        var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        this.http.post('api/TwoPhaseTransformer', JSON.stringify({ ID: 0, Name: newItem.name, HVNodeNo: newItem.hvNodeNo, LVNodeNo: newItem.lvNodeNo, HVVoltageRated: newItem.hvVoltageRated, LVVoltageRated: newItem.lvVoltageRated, ApparentPowerRated: newItem.apparentPowerRated, LoadLossesRated: newItem.loadLossesRated, ShortCircuitVoltage: newItem.shortCircuitVoltage }), { headers: headers }).subscribe((data: Object) => {
            //Czekamy na wykonanie sie POST, zeby zrobic GET i WPISAC dane do tabeli we front end

            // po operacji post ustawiany jest specyficzny ID w bazie SQL, aby dany wiersz w fron-end miał taki sam ID, musze sciagnac te dane do frontendu    
            this.http.get('api/TwoPhaseTransformer/Get').subscribe(result => {
                this.rowData = result.json();
            })

            var res = this.gridOptions.api.updateRowData({ add: [newItem] });
            this.printResult(res);
        },
        );
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


import { Component, Inject } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { GridOptions } from "ag-grid/main";

@Component({
    templateUrl: './overheadlines.component.html'
})

export class OverheadLinesComponent {
    public overheadline: OverheadLines[] = [];

    gridOptions: GridOptions;
    rowData: any[];

    constructor(public http: Http, @Inject('BASE_URL') baseUrl: string) {
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
                http.put(baseUrl + 'api/OverheadLine/' + event.data.id, JSON.stringify({ ID: event.data.id, Name: event.data.name, StartNodeNo: event.data.startNodeNo, EndNodeNo: event.data.endNodeNo, Length: event.data.length, UnitaryResistance: event.data.unitaryResistance, UnitaryReactance: event.data.unitaryReactance, UnitaryCapacitance: event.data.unitaryCapacitance }), { headers: headers }).subscribe();
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
                            headerName: "Start node no.", field: "startNodeNo", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "End node no.", field: "endNodeNo", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Length [km]", field: "length", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Unitary Resistance [Ω/km]", field: "unitaryResistance", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Unitary Reactance [Ω/km]", field: "unitaryReactance", type: "numericColumn",
                            valueFormatter: this.numberValueFormatter,
                            valueSetter: this.numberValueSetter
                        },
                        {
                            headerName: "Unitary Capacitance [uS/km]", field: "unitaryCapacitance", type: "numericColumn",
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
        this.http.get(baseUrl + 'api/OverheadLine/Get').subscribe(result => {
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

        if (params.colDef.field == "startNodeNo") {
            params.data.startNodeNo = params.newValue;
        }
        if (params.colDef.field == "endNodeNo") {
            params.data.endNodeNo = params.newValue;
        }
        if (params.colDef.field == "length") {
            params.data.length = params.newValue;
        }
        if (params.colDef.field == "unitaryResistance") {
            params.data.unitaryResistance = params.newValue;
        }
        if (params.colDef.field == "unitaryReactance") {
            params.data.unitaryReactance = params.newValue;
        }
        if (params.colDef.field == "unitaryCapacitance") {
            params.data.unitaryCapacitance = params.newValue;
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
                this.http.delete('api/OverheadLine/' + rowIdArray[rowId], { headers: headers }).subscribe();
            }
        } else { }
    }

    onAddRow() {

        var newItem = {
            //id: 0,
            name: "Overhead Line",
            startNodeNo: 0,
            endNodeNo: 0,
            length: 0,
            unitaryResistance: 0,
            unitaryReactance: 0,
            unitaryCapacitance: 0,
        };
        var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        this.http.post('api/OverheadLine', JSON.stringify({ ID: 0, Name: newItem.name, StartNodeNo: newItem.startNodeNo, EndNodeNo: newItem.endNodeNo, Length: newItem.length, UnitaryResistance: newItem.unitaryResistance, UnitaryReactance: newItem.unitaryReactance, UnitaryCapacitance: newItem.unitaryCapacitance }), { headers: headers }).subscribe((data: Object) => {
            //Czekamy na wykonanie sie POST, zeby zrobic GET i WPISAC dane do tabeli we front end

            // po operacji post ustawiany jest specyficzny ID w bazie SQL, aby dany wiersz w fron-end miał taki sam ID, musze sciagnac te dane do frontendu    
            this.http.get('api/OverheadLine/Get').subscribe(result => {
                this.rowData = result.json();
            })

            var res = this.gridOptions.api.updateRowData({ add: [newItem] });
            this.printResult(res);
        },
        );
    }
}

export interface OverheadLines {
    id: number;
    name: string;
    startNodeNo: number;
    endNodeNo: number;
    length: number;
    unitaryResistance: number;
    unitaryReactance: number;
    unitaryCapacitance: number;
}


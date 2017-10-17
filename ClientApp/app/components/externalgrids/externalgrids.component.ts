import {  Component, Inject } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { GridOptions } from "ag-grid/main";

@Component({
    templateUrl: './externalgrids.component.html',
})

export class ExternalGridsComponent {
  
  public externalgrid: ExternalGrids[] = []

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
        http.put(baseUrl + 'api/ExternalGrid/' + event.data.id, JSON.stringify({ ID: event.data.id, Name: event.data.name, NodeNo: event.data.nodeNo, NodeType: event.data.nodeType, VoltageAngle: event.data.voltageAngle, VoltageSetpoint: event.data.voltageSetpoint, ActivePower: event.data.activePower, ReactivePower: event.data.reactivePower }), { headers: headers }).subscribe();
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
              headerName: "Type of node", field: "nodeType", width: 100, cellEditor: 'select',
              cellEditorParams: {
                values: [
                  "SL",
                  "PV",
                  "PQ"
                ]
              }
            },
            { headerName: "No. of node", hide: true, field: "nodeNo", width: 100, type: "numericColumn" },
            {
              headerName: "Voltage angle [deg]", field: "voltageAngle", type: "numericColumn",
              valueFormatter: this.numberValueFormatter,
              valueSetter: this.numberValueSetter
            },
            {
              headerName: "Voltage setpoint [p.u.]", field: "voltageSetpoint", width: 170, type: "numericColumn", cellEditor: "text",
              valueFormatter: this.numberValueFormatter,
              valueSetter: this.numberValueSetter
            },
            {
              headerName: "Active power [MW]", field: "activePower", type: "numericColumn",
              valueFormatter: this.numberValueFormatter,
              valueSetter: this.numberValueSetter
            },
            {
              headerName: "Reactive power [MVAr]", field: "reactivePower", width: 170, type: "numericColumn",
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
    this.http.get(baseUrl + 'api/ExternalGrid/Get').subscribe(result => {
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

    if (params.colDef.field == "voltageAngle") {
      params.data.voltageAngle = params.newValue;
    }
    if (params.colDef.field == "voltageSetpoint") {
      params.data.voltageSetpoint = params.newValue;
    }
    if (params.colDef.field == "activePower") {
      params.data.activePower = params.newValue;
    }
    if (params.colDef.field == "reactivePower") {
      params.data.reactivePower = params.newValue;
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
        this.http.delete('api/ExternalGrid/' + rowIdArray[rowId], { headers: headers }).subscribe();
      }
    } else { }
  }

  onAddRow() {

    var newItem = {
      //id: 0,
      name: "External Grid",
      nodeNo: 0,
      nodeType: "SL",
      voltageAngle: 0,
      voltageSetpoint: 0,
      activePower: 0,
      reactivePower: 0
    };
    var headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    this.http.post('api/ExternalGrid', JSON.stringify({ ID: 0, Name: newItem.name, NodeNo: newItem.nodeNo, NodeType: newItem.nodeType, VoltageAngle: newItem.voltageAngle, VoltageSetpoint: newItem.voltageSetpoint, ActivePower: newItem.activePower, ReactivePower: newItem.reactivePower }), { headers: headers }).subscribe((data: Object) => {
      //Czekamy na wykonanie sie POST, zeby zrobic GET i WPISAC dane do tabeli we front end

      // po operacji post ustawiany jest specyficzny ID w bazie SQL, aby dany wiersz w fron-end miał taki sam ID, musze sciagnac te dane do frontendu    
      this.http.get('api/ExternalGrid/Get').subscribe(result => {
        this.rowData = result.json();
      })

      var res = this.gridOptions.api.updateRowData({ add: [newItem] });
      this.printResult(res);
    },
    );
  }
}

export interface ExternalGrids {
  id: number;
  name: string;
  nodeNo: number;
  nodeType: string;
  voltageAngle: number;
  voltageSetpoint: number;
  activePower: number;
  reactivePower: number;
}
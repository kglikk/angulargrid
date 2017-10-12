import {
  Component, Inject, Input, trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { FormsModule } from '@angular/forms';

import { GridOptions } from "ag-grid/main";
import { ButtonDeleteComponent } from './button-delete.component';
//import {ButtonDeleteComponent } from './components/externalgrids/button-delete.component';

@Component({
  selector: 'my-app',  
  templateUrl: './externalgrids.component.html',
})

export class ExternalGridsComponent {
  // to get the ExternalGrids Details 
  public externalgrid: ExternalGrids[] = []

  gridOptions: GridOptions;
  rowData: any[];
  columnDefs: any[];
  defaultColDef: any[];

  //for animation status   
  animStatus: string = 'inactive';

  @Inject('BASE_URL') baseUrl: string;

  constructor(public http: Http, @Inject('BASE_URL') baseUrl: string) {
    // we pass an empty gridOptions in, so we can grab the api out
    this.gridOptions = <GridOptions>{
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit(); //make the currently visible columns fit the screen.
      },     
      
    }; 

    this.gridOptions = {
      onCellValueChanged: function(event) {
        var headers = new Headers();
        headers.append('Content-Type', 'application/json; charset=utf-8');
        console.log("onCellValueChanged");
        console.log('data after changes is: ', event.data);
        http.put(baseUrl + 'api/ExternalGrid/' + event.data.id, JSON.stringify({ ID: event.data.id, Name: event.data.name, NodeNo: event.data.nodeNo, NodeType: event.data.nodeType, VoltageAngle: event.data.voltageAngle, VoltageSetpoint: event.data.voltageSetpoint, ActivePower: event.data.activePower, ReactivePower: event.data.reactivePower }), { headers: headers }).subscribe();
        //alert("External Grid detail updated");
        
      },
      onCellEditingStopped: () => {
        console.log("onCellEditingStopped");
      },
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
            //{ headerName: "",field: "value", cellRendererFramework: ButtonDeleteComponent, width: 75, editable:false, enableSorting: false, enableFilter: false, enableColResize:false},            
            { headerName: "Name", field: "name", width: 110 },
            { headerName: "No. of node", field: "nodeNo", width: 100 },
            { headerName: "Type of node", field: "nodeType", width: 100 },
            { headerName: "Voltage angle [deg]", field: "voltageAngle" },
            { headerName: "Voltage setpoint [p.u.]", field: "voltageSetpoint" },
            { headerName: "Active power [MW]", field: "activePower" },
            { headerName: "Reactive power [MVAr]", field: "reactivePower", width: 170 }
          ]
        }
      ],
      defaultColDef: {
        // set every column width
        width: 150,
        // make every column editable
        editable: true,
        // make every column use 'text' filter by default
        filter: 'text'
      },
    }

    this.http.get(baseUrl + 'api/ExternalGrid/GetExternalGrids').subscribe(result => {
      this.rowData = result.json();
    });
    //this.AddExtGridTable = false;    
  }
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
  selectAllRows() {
    this.gridOptions.api.selectAll();
  }
  
  //to get all the Student data from Web API  
  getData() {

    this.http.get('api/ExternalGrid/GetExternalGrids').subscribe(result => {
      this.rowData = result.json(); //było this.externalgrid
    }); //, error => console.error(error)
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
      this.http.post('api/ExternalGrid', JSON.stringify({ /*ID: newItem.id,*/ Name: newItem.name, NodeNo: newItem.nodeNo, NodeType: newItem.nodeType, VoltageAngle: newItem.voltageAngle, VoltageSetpoint: newItem.voltageSetpoint, ActivePower: newItem.activePower, ReactivePower: newItem.reactivePower }), { headers: headers }).subscribe();
      
      this.getData();
      var res = this.gridOptions.api.updateRowData({add: [newItem]});
      this.printResult(res);
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
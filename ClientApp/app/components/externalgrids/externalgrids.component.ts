import {
  Component, Input, trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
//import { Ng2SmartTableModule } from 'ng2-smart-table';
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';


import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  animations: [
    trigger('buttonReSize', [
      state('inactive', style({
        transform: 'scale(1)',
        backgroundColor: '#f83500'
      })),
      state('active', style({
        transform: 'scale(1.4)',
        backgroundColor: '#0094ff'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ]),

    trigger('moveBottom', [

      transition('void => *', [
        animate(900, keyframes([
          style({ opacity: 0, transform: 'translateY(-200px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),

        ]))
      ])

    ]),
    trigger('moveTop', [

      transition('void => *', [
        animate(900, keyframes([
          style({ opacity: 0, transform: 'translateY(+400px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateY(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateY(0)', offset: 1 }),

        ]))
      ])

    ]),

    trigger('moveRight', [

      transition('void => *', [
        animate(900, keyframes([
          style({ opacity: 0, transform: 'translateX(-400px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1 }),

        ]))
      ])

    ]),
    trigger('movelLeft', [

      transition('void => *', [
        animate(900, keyframes([
          style({ opacity: 0, transform: 'translateX(+400px)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(25px)', offset: .75 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1 }),

        ]))
      ])

    ]),
    trigger('fadeIn', [
      transition('* => *', [
        animate('1s', keyframes([
          style({ opacity: 0, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(0)', offset: 1 }),
        ]))
      ])
    ]),
  ],
  //template: require('./externalgrids.component.html')
  /*
  template:
  `<jqxDataTable
      [width]="850" [source]="dataAdapter" [columns]="columns"
      [pageable]="true" [columnsResize]="true" [pagerButtonsCount]="10">
  </jqxDataTable>`, */
  templateUrl: './externalgrids.component.html',
  styleUrls: ['./externalgrids.component.css']


})

export class ExternalGridsComponent {

  // to get the ExternalGrids Details 
  public externalgrid: ExternalGrids[] = [];

  source: any =
  {
      localdata: [
          ['Alfreds Futterkiste', 'Maria Anders', 'Sales Representative', 'Obere Str. 57', 'Berlin', 'Germany'],
          ['Ana Trujillo Emparedados y helados', 'Ana Trujillo', 'Owner', 'Avda. de la Constitucin 2222', 'Mxico D.F.', 'Mexico'],
          ['Antonio Moreno Taquera', 'Antonio Moreno', 'Owner', 'Mataderos 2312', 'Mxico D.F.', 'Mexico'],
          ['Around the Horn', 'Thomas Hardy', 'Sales Representative', '120 Hanover Sq.', 'London', 'UK'],
          ['Berglunds snabbkp', 'Christina Berglund', 'Order Administrator', 'Berguvsvgen 8', 'Lule', 'Sweden'],
          ['Blauer See Delikatessen', 'Hanna Moos', 'Sales Representative', 'Forsterstr. 57', 'Mannheim', 'Germany'],
          ['Blondesddsl pre et fils', 'Frdrique Citeaux', 'Marketing Manager', '24, place Klber', 'Strasbourg', 'France'],
          ['Blido Comidas preparadas', 'Martn Sommer', 'Owner', 'C\/ Araquil, 67', 'Madrid', 'Spain'],
          ['Bon app', 'Laurence Lebihan', 'Owner', '12, rue des Bouchers', 'Marseille', 'France'],
          ['Bottom-Dollar Markets', 'Elizabeth Lincoln', 'Accounting Manager', '23 Tsawassen Blvd.', 'Tsawassen', 'Canada'],
          ['B`s Beverages', 'Victoria Ashworth', 'Sales Representative', 'Fauntleroy Circus', 'London', 'UK'],
          ['Cactus Comidas para llelet', 'Patricio Simpson', 'Sales Agent', 'Cerrito 333', 'Buenos Aires', 'Argentina'],
          ['Centro comercial Moctezuma', 'Francisco Chang', 'Marketing Manager', 'Sierras de Granada 9993', 'Mxico D.F.', 'Mexico'],
          ['Chop-suey Chinese', 'Yang Wang', 'Owner', 'Hauptstr. 29', 'Bern', 'Switzerland'],
          ['Comrcio Mineiro', 'Pedro Afonso', 'Sales Associate', 'Av. dos Lusadas, 23', 'Sao Paulo', 'Brazil'],
          ['Consolidated Holdings', 'Elizabeth Brown', 'Sales Representative', 'Berkeley Gardens 12 Brewery', 'London', 'UK'],
          ['Drachenblut Delikatessen', 'Sven Ottlieb', 'Order Administrator', 'Walserweg 21', 'Aachen', 'Germany'],
          ['Du monde entier', 'Janine Labrune', 'Owner', '67, rue des Cinquante Otages', 'Nantes', 'France'],
          ['Eastern Connection', 'Ann Devon', 'Sales Agent', '35 King George', 'London', 'UK'],
          ['Ernst Handel', 'Roland Mendel', 'Sales Manager', 'Kirchgasse 6', 'Graz', 'Austria']
      ],
      datafields: [
          { name: 'CompanyName', type: 'string', map: '0' },
          { name: 'ContactName', type: 'string', map: '1' },
          { name: 'Title', type: 'string', map: '2' },
          { name: 'Address', type: 'string', map: '3' },
          { name: 'City', type: 'string', map: '4' },
          { name: 'Country', type: 'string', map: '5' }
      ],
      datatype: 'array'
  };
  dataAdapter: any = new jqx.dataAdapter(this.source);
  columns: any[] =
  [
      { text: 'Company Name', datafield: 'CompanyName', width: 200 },
      { text: 'Contact Name', datafield: 'ContactName', width: 150 },
      { text: 'Contact Title', datafield: 'Title', width: 100 },
      { text: 'Address', datafield: 'Address', width: 100 },
      { text: 'City', datafield: 'City', width: 100 },
      { text: 'Country', datafield: 'Country' }
  ];



/*
  source: any =
  {
      datatype: 'xml',
      datafields: [
          { name: 'ProductName', type: 'string' },
          { name: 'QuantityPerUnit', type: 'int' },
          { name: 'UnitPrice', type: 'float' },
          { name: 'UnitsInStock', type: 'float' },
          { name: 'Discontinued', type: 'bool' }
      ],
      root: 'Products',
      record: 'Product',
      id: 'ProductID',
      url: './products.xml'
  };

  dataAdapter: any = new jqx.dataAdapter(this.source);

  cellsrenderer = (row: number, columnfield: string, value: string | number, defaulthtml: string, columnproperties: any, rowdata: any): string => {
      if (value < 20) {
          return `<span style='margin: 4px; float:${columnproperties.cellsalign}; color: #ff0000;'>${value}</span>`;
      }
      else {
          return `<span style='margin: 4px; float:${columnproperties.cellsalign}; color: #008000;'>${value}</span>`;
      }
  };

  columns: any[] =
  [
      { text: 'Product Name', columngroup: 'ProductDetails', datafield: 'ProductName', width: 250 },
      { text: 'Quantity per Unit', columngroup: 'ProductDetails', datafield: 'QuantityPerUnit', cellsalign: 'right', align: 'right' },
      { text: 'Unit Price', columngroup: 'ProductDetails', datafield: 'UnitPrice', align: 'right', cellsalign: 'right', cellsformat: 'c2' },
      { text: 'Units In Stock', datafield: 'UnitsInStock', cellsalign: 'right', cellsrenderer: this.cellsrenderer, width: 100 },
      { text: 'Discontinued', columntype: 'checkbox', datafield: 'Discontinued', align: 'center' }
  ];

  columngroups: any[] =
  [
      { text: 'Product Details', align: 'center', name: 'ProductDetails' }
  ];

  */
  /* 
  
   // to hide and Show Insert/Edit   
   AddExtGridTable: Boolean = false;
  
   public createButton = true;
  
   // To stored ExternalGrid Informations for insert/Update and Delete  
   public IDs = 0;
   public Names = "";
   public NodeNos = 0;
   public NodeTypes = "";
   public VoltageAngles = 0;
   public VoltageSetpoints = 0;
   public ActivePowers = 0;
   public ReactivePowers = 0;
  
   //For display Edit and Delete Images  
   public imgEdit = require("./images/edit.gif");
   public imgDelete = require("./Images/delete.gif");
  
  
   //for animation status   
   animStatus: string = 'inactive';
  
   
  
   constructor(public http:Http ) {   //public http:  Http, @Inject('/api/ExternalGridController') public originUrl: string
     
     this.AddExtGridTable = false;
     this.getData();
  
   }
  
   //for Animation to toggle Active and Inactive  
   animButton() {
     this.animStatus = (this.animStatus === 'inactive' ? 'active' : 'inactive');
   }
  
   //to get all the Student data from Web API  
   getData() {
     this.http.get('api/ExternalGridController/GetExternalGrids').subscribe(result => {
       this.externalgrid = result.json();
     });
   }
   // to show form for add new Student Information  
   AddExtGrid() {
     this.animButton();
     this.AddExtGridTable = true;
     this.createButton = false;
     this.IDs = 0;
     this.Names = "";
     this.NodeNos = 0;
     this.NodeTypes = "";
     this.VoltageAngles = 0;
     this.VoltageSetpoints = 0;
     this.ActivePowers = 0;
     this.ReactivePowers = 0;
   }
  
   // to show form for edit Student Information  
   editExtGridDetails(ID: number, Name: string, NodeNo: number, NodeType: string, VoltageAngle: number, VoltageSetpoint: number, ActivePower: number, ReactivePower: number) {
     this.animButton();
     this.AddExtGridTable = true;
     this.IDs = ID;
     this.Names = Name;
     this.NodeNos = NodeNo;
     this.NodeTypes = NodeType;
     this.VoltageAngles = VoltageAngle;
     this.VoltageSetpoints = VoltageSetpoint;
     this.ActivePowers = ActivePower;
     this.ReactivePowers = ReactivePower;
   }
   // If the studentid is 0 then insert the student infromation using post and if the student id is more than 0 then edit using put mehod  
   addExtGridDetails(ID: number, Name: string, NodeNo: number, NodeType: string, VoltageAngle: number, VoltageSetpoint: number, ActivePower: number, ReactivePower: number) {
     
   
     var headers = new Headers();
     headers.append('Content-Type', 'application/json; charset=utf-8');
     
     if (ID == 0) {
       this.http.post('api/ExternalGridController', JSON.stringify({ ID: ID, Name: Name, NodeNo: NodeNo, NodeType: NodeType, VoltageAngle: VoltageAngle, VoltageSetpoint: VoltageSetpoint, ActivePower: ActivePower, ReactivePower: ReactivePower }), { headers: headers }).subscribe();
       alert("External Grid created");
     }   
     else {
       this.http.put('api/ExternalGridController/' + ID, JSON.stringify({ ID: ID, Name: Name, NodeNo: NodeNo, NodeType: NodeType, VoltageAngle: VoltageAngle, VoltageSetpoint: VoltageSetpoint, ActivePower: ActivePower, ReactivePower: ReactivePower }), { headers: headers }).subscribe();
       alert("External Grid detail updated");
     }    
     this.createButton = true;
     this.AddExtGridTable = false;
     this.getData();
   }
  
   //to Delete the selected student detail from database.  
   deleteExtGridDetails(id: number) {
     //alert("Kliknałem");    
     
     if (window.confirm('Are you sure you want to delete?')) {
       var headers = new Headers();
       headers.append('Content-Type', 'application/json; charset=utf-8');  
       this.http.delete('api/ExternalGridController/' + id, { headers: headers }).subscribe(); 
       alert("Student Detail Deleted");  //musi być uwzglednione zeby dobrze działało
       this.getData();   
         
     } else {
       
     }
  
  
     
   }
  
   closeEdits() {
     //this.AddExtGridTable = true;
     this.AddExtGridTable = false;
     this.createButton = true;
     this.IDs = 0;
     this.Names = "";
     this.NodeNos = 0;
     this.NodeTypes = "";
     this.VoltageAngles = 0;
     this.VoltageSetpoints = 0;
     this.ActivePowers = 0;
     this.ReactivePowers = 0;
   }
  
  */

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


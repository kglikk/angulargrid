

  /*

  @Component({
  selector: 'my-app',
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
  templateUrl: './externalgrids.component.html',
})

  // to hide and Show Insert/Edit   
  AddExtGridTable: Boolean = false;
// To stored ExternalGrid Informations for insert/Update and Delete  
  public IDs = 0;
  public Names = "";
  public NodeNos = 0;
  public NodeTypes = "";
  public VoltageAngles = 0;
  public VoltageSetpoints = 0;
  public ActivePowers = 0;
  public ReactivePowers = 0;

  public createButton = true;
 public newCount = 1;

  
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

    var newItem = {
      id: ID,
      name: Name,
      nodeNo: NodeNo,
      nodeType: NodeType,
      voltageAngle: VoltageAngle,
      voltageSetpoint: VoltageSetpoint,
      activePower: ActivePower,
      reactivePower: ReactivePower
    };

    //wpisanie do tabeli
    var res = this.gridOptions.api.updateRowData({ add: [newItem] });
    this.printResult(res);


    //wpisanie do bazy danych
    if (ID == 0) {
      this.http.post('api/ExternalGrid', JSON.stringify({ ID: ID, Name: Name, NodeNo: NodeNo, NodeType: NodeType, VoltageAngle: VoltageAngle, VoltageSetpoint: VoltageSetpoint, ActivePower: ActivePower, ReactivePower: ReactivePower }), { headers: headers }).subscribe();
      alert("External Grid created");
    }
    else {
      this.http.put('api/ExternalGrid/' + ID, JSON.stringify({ ID: ID, Name: Name, NodeNo: NodeNo, NodeType: NodeType, VoltageAngle: VoltageAngle, VoltageSetpoint: VoltageSetpoint, ActivePower: ActivePower, ReactivePower: ReactivePower }), { headers: headers }).subscribe();
      alert("External Grid detail updated");
    }
    this.createButton = true;
    this.AddExtGridTable = false;
    this.getData();
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

  //for Animation to toggle Active and Inactive  
  animButton() {
    this.animStatus = (this.animStatus === 'inactive' ? 'active' : 'inactive');
  }

    createNewRowData() {
    var newData = {
      name: "Dodatek " + this.newCount,
      nodeNo: this.newCount,
      nodeType: 'PV',
      voltageAngle: 90,
      voltageSetpoint: 1,
      activePower: 20,
      reactivePower: 2
    };
    this.newCount++;
    return newData;
  }
//For display Edit and Delete Images  
  public imgEdit = require("./images/edit.gif");
  public imgDelete = require("./images/delete.gif");


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
  


// If the studentid is 0 then insert the student infromation using post and if the student id is more than 0 then edit using put mehod  
function addExtGridDetails(ID: number, Name: string, NodeNo: number, NodeType: string, VoltageAngle: number, VoltageSetpoint: number, ActivePower: number, ReactivePower: number) {
    
        //alert("jestem w addExtGridDetails");
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
        this.getData(this.baseUrl);
      }
    
      //to Delete the selected student detail from database.  
      function  deleteExtGridDetails(id: number) {
        //alert("Kliknałem");     
        if (window.confirm('Are you sure you want to delete?')) {
          var headers = new Headers();
          headers.append('Content-Type', 'application/json; charset=utf-8');
          this.http.delete('api/ExternalGridController/' + id, { headers: headers }).subscribe();
          alert("Student Detail Deleted");  //musi być uwzglednione zeby dobrze działało
          this.getData(this.baseUrl);
        } else { }
    
    
    
      }
    
   function closeEdits() {
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
    }
      */



        //to Delete the selected student detail from database.  
  /*
  deleteExtGridDetails(id: number) {
    //alert("Kliknałem");     
    if (window.confirm('Are you sure you want to delete?')) {
      var headers = new Headers();
      headers.append('Content-Type', 'application/json; charset=utf-8');
      this.http.delete(this.baseUrl+'api/ExternalGrid/' + id, { headers: headers }).subscribe();
      alert("Student Detail Deleted");  //musi być uwzglednione zeby dobrze działało
      this.getData(this.baseUrl);
    } else { }
  } */


  
  /*
  onAddRow() {
    this.createButton = false;
    this.AddExtGridTable = true;
    var newItem = this.createNewRowData();
    var res = this.gridOptions.api.updateRowData({ add: [newItem] });
    this.printResult(res);
  } */

import {Component} from '@angular/core';
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'buttonDelete',
    template: '<span><button style="height: 20px" (click)=hej() class="btn btn-danger">Delete</button></span>',
    styles: [
        `.btn {
            line-height: 0.5
        }`
    ]
})

export class ButtonDeleteComponent implements ICellRendererAngularComp {
    public params: any;
   

    
        agInit(params: any): void {
            this.params = params;
        }
    
        public invokeParentMethod() {
            this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`)
        }
    
        refresh(): boolean {
            return false;
        }

        public hej(){
            alert("hej");
          }


}
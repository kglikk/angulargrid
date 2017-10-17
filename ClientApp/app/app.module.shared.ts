

import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import {AgGridModule} from 'ag-grid-angular/main';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { FetchDataComponent } from './components/fetchdata/fetchdata.component';
import { CounterComponent } from './components/counter/counter.component';
import { ExternalGridsComponent } from './components/externalgrids/externalgrids.component';
import { OverheadLinesComponent } from './components/overheadlines/overheadlines.component';
import { TwoPhaseTransformersComponent } from './components/twophasetransformers/twophasetransformers.component';
import { LoadFlowComponent } from './components/loadflow/loadflow.component';


//import { Ng2SmartTableModule } from 'ng2-smart-table';
//import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';
//import { DataTableModule }   from 'jqwidgets-framework/demos/angular/app/modules/datatable.module';


//import {BaseComponentFactory} from 'ag-grid-angular/src/baseComponentFactory';

@NgModule({
    
    //określ który komponent należy do tego modułu
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        CounterComponent,
        FetchDataComponent,
        ExternalGridsComponent,
        OverheadLinesComponent,
        TwoPhaseTransformersComponent,
        LoadFlowComponent,
       
      //  BaseComponentFactory       
          
    ],

    //określ moduły, które bedą dostepne dla wszystkich komponentów które należą do tego modułu
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        //AgGridModule.forRoot(),
        AgGridModule.withComponents([]),
        
        
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'externalgrids', component: ExternalGridsComponent },
            { path: 'overheadlines', component: OverheadLinesComponent },
            { path: 'twophasetransformers', component: TwoPhaseTransformersComponent },
            { path: 'loadflow', component: LoadFlowComponent },            
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}

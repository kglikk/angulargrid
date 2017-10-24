import { AuthGuard } from './services/auth-guard.service';

import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, CanActivate } from '@angular/router';
import {AgGridModule} from 'ag-grid-angular/main';

import { AppComponent } from './components/app/app.component';
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { HomeComponent } from './components/home/home.component';
import { ExternalGridsComponent } from './components/externalgrids/externalgrids.component';
import { OverheadLinesComponent } from './components/overheadlines/overheadlines.component';
import { TwoPhaseTransformersComponent } from './components/twophasetransformers/twophasetransformers.component';
import { LoadFlowComponent } from './components/loadflow/loadflow.component';

import { AuthService } from './services/auth.service';
import { CallbackComponent } from './components/callback/callback.component';





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
        ExternalGridsComponent,
        OverheadLinesComponent,
        TwoPhaseTransformersComponent,
        LoadFlowComponent,
        CallbackComponent
       
      //  BaseComponentFactory       
          
    ],

    //definiuje obiekty Injectable, ktore beda dostepne dla modulow
    providers: [
        AuthService,
        AuthGuard
        
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
            { path: 'externalgrids', component: ExternalGridsComponent, canActivate: [AuthGuard] },
            { path: 'overheadlines', component: OverheadLinesComponent, canActivate: [AuthGuard] },
            { path: 'twophasetransformers', component: TwoPhaseTransformersComponent, canActivate: [AuthGuard] },
            { path: 'loadflow', component: LoadFlowComponent, canActivate: [AuthGuard] },
            { path: 'callback', component: CallbackComponent },            
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}

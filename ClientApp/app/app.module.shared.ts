
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


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
import { jqxGridComponent } from 'jqwidgets-framework/jqwidgets-ts/angular_jqxgrid';



@NgModule({
    
    declarations: [
        AppComponent,
        NavMenuComponent,
        CounterComponent,
        FetchDataComponent,
        HomeComponent,
        ExternalGridsComponent,
        OverheadLinesComponent,
        TwoPhaseTransformersComponent,
        LoadFlowComponent,
        jqxGridComponent
          
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        //Ng2SmartTableModule,
        //jqxDataTableComponent,
        RouterModule.forRoot([
            { path: '', redirectTo: 'home', pathMatch: 'full' },
            { path: 'home', component: HomeComponent },
            { path: 'counter', component: CounterComponent },
            { path: 'fetch-data', component: FetchDataComponent },
            { path: 'externalgrids', component: ExternalGridsComponent },
            { path: 'overheadlines', component: OverheadLinesComponent },
            { path: 'twophasetransformers', component: TwoPhaseTransformersComponent },
            { path: 'loadflow', component: LoadFlowComponent },
            { path: 'product', component: LoadFlowComponent },
            { path: '**', redirectTo: 'home' }
        ])
    ]
})
export class AppModuleShared {
}
import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent }  from './app.component';
import {NavbarComponent} from "./components/navbar.component";
import {routing} from "./app.router";
import {AboutComponent} from "./components/about.component";
import {LogviewerComponent} from "./components/logviewer.component";
import {Http, HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TruncatePipe} from "./pipes/truncate.pipe";
import {DatetimePickerComponent} from "./components/datetime.component";
import {AppGlobals} from "./app.globals";
import {DeepViewComponent} from "./components/deep_view.component";
import {Constants} from "./constants";
import {PreViewComponent} from "./components/pre_view.component";
import {PaginationComponent} from "./components/pagination.component";
import {DistinctInputComponent} from "./components/distinct_input.component";
import {LastSearchesComponent} from "./components/last_searches.component";
import {ConfigureDataSourcesComponent} from "./components/data_sources.component";
import {ColumnsSetupComponent} from "./components/columns_setup.component";


@NgModule({
  imports:      [ BrowserModule, routing, HttpModule, FormsModule ],
  declarations: [
    AppComponent, NavbarComponent,
    AboutComponent, LogviewerComponent,
    DatetimePickerComponent,
    DeepViewComponent,
    PreViewComponent,
    PaginationComponent,
    DistinctInputComponent,
    LastSearchesComponent,
    TruncatePipe,
    ConfigureDataSourcesComponent,
    ColumnsSetupComponent
  ],
  bootstrap:    [ AppComponent ],
  providers: [AppGlobals]
})
export class AppModule { }

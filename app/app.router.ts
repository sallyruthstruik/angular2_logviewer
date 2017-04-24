

import {Routes, RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {AboutComponent} from "./components/about.component";
import {ModuleWithProviders} from "@angular/core";
import {LogviewerComponent} from "./components/logviewer.component";
import {ConfigureDataSourcesComponent} from "./components/data_sources.component";
import {ChartsComponent} from "./components/charts.component";

const routes: Routes = [
  {
    path: "about",
    component: AboutComponent
  },
  {
    path: "datasources",
    component: ConfigureDataSourcesComponent
  },
  {
    path: "view_logs/:id",
    component: LogviewerComponent
  },
  {
    path: "charts/:id",
    component: ChartsComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {useHash: true});



import {Routes, RouterModule} from "@angular/router";
import {AppComponent} from "./app.component";
import {AboutComponent} from "./components/about.component";
import {ModuleWithProviders} from "@angular/core";
import {LogviewerComponent} from "./components/logviewer.component";

const routes: Routes = [
  {
    path: "",
    component: LogviewerComponent
  },
  {
    path: "about",
    component: AboutComponent
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

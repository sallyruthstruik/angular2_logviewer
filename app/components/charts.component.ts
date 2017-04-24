/**
 * Created by stas on 24.04.17.
 */
import {Component, Input} from '@angular/core';
import {DataSourceService} from "../services/data_source.service";
import {ActivatedRoute} from "@angular/router";
import {DataSource} from "./data_sources.component";
import * as Chart from "chart.js";
import {ChartService} from "../services/chart.service";

@Component({
  selector: 'charts',
  templateUrl: "app/components/charts.component.html",
  providers: [DataSourceService, ChartService]
})
export class ChartsComponent  {

  dataSourceId: string;
  private dataSource: DataSource = {} as DataSource;

  aggregationPipeline: any[] = [];

  line_data: Array<any> = [
    {data: [1, 2, 3, 4, 5], label: "A"},
    {data: [3, 4, 2, 4, 3, 1], label: "A"},
  ];

  constructor(
    private route: ActivatedRoute,
    private dataSourceService: DataSourceService,
    private chartService: ChartService
  ){

    this.route.params.subscribe((params)=>{
      this.dataSourceId = params["id"];
      this.dataSourceService.getDataSource(this.dataSourceId).subscribe(
        (resp)=>{this.dataSource = resp},
        (err)=>{console.log(err)}
      )
    })
  }



}

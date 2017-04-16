import {Component} from "@angular/core";
import {DataSourceService} from "../services/data_source.service";
/**
 * Created by stas on 16.04.17.
 */

export interface DataSource{
  id?: string,
  name: string,
  collection_name: string,
  display_columns?: string[]
}

@Component({
  selector: 'data_sources',
  templateUrl: "app/components/data_sources.component.html",
  providers: [DataSourceService]
})
export class ConfigureDataSourcesComponent{

  displayModal = false;

  dataSources: DataSource[] = [];

  selectedDataSource: DataSource = {} as DataSource;

  constructor(
    private dataSourcesService: DataSourceService
  ){

    this.fetchDataSources()

  }

  private isEditingDataSource(){
      return Object.keys(this.selectedDataSource).length > 0;
  }

  private fetchDataSources() {
    this.dataSourcesService.getDataSources().subscribe(resp=>{
      this.dataSources = resp.results;
    })
  }

  saveDataSource(){
    this.dataSourcesService.save(this.selectedDataSource).subscribe(
      (resp)=>{
        this.fetchDataSources();
      },
      (err)=>console.log(err)
    );

    this.selectedDataSource = {} as DataSource;
    this.displayModal = false;
  }
}

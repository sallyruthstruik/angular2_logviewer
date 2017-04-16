/**
 * Created by stas on 16.04.17.
 */

import {Injectable} from "@angular/core";
import {Http, Headers} from "@angular/http";
import {Constants} from "../constants";
import {DataSource} from "../components/data_sources.component";
import {Filters} from "../components/logviewer.component";

@Injectable()
export class DataSourceService{
  private url: string;

  constructor(
    private http: Http
  ){
    this.url = `${Constants.HOST}/api/data_sources`
  }

  public getDataSources(){
      return this.http.get(this.url)
        .map(item=>item.json());
  }

  save(selectedDataSource: DataSource) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    if(selectedDataSource.id){
      return this.http.put(
        `${this.url}/${selectedDataSource.id}`,
        JSON.stringify(selectedDataSource),
        {headers}
      ).map(res => res.json())
    }else{
      return this.http.post(
        this.url,
        JSON.stringify(selectedDataSource),
        {headers}
      )
    }
  }

  /**
   * Saves filtration statement into DB
   * @param dataSourceId
   * @param filters
   */
  saveFilter(dataSourceId: string, filters: Filters) {
    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http.post(
      `${this.url}/saveFilter`,
      JSON.stringify({filters}),
      {headers}
    )
  }

  getColumns(dataSourceId: string) {
    return this.http.get(
      `${this.url}/getColumns/${dataSourceId}`
    ).map(resp=>resp.json())
  }
}


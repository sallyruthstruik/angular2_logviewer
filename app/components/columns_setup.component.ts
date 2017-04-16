import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {DataSourceService} from "../services/data_source.service";
import {DataSource} from "./data_sources.component";

@Component({
  selector: 'columns-setup',
  templateUrl: "app/components/columns-setup.component.html",

})
export class ColumnsSetupComponent implements OnInit{
  ngOnInit(): void {
    this.dataSourceService.getColumns(this.dataSource.id).subscribe(
      (resp)=>{this.columns = resp},
      (err)=>{console.log(err)}
    )
  }


  @Input() dataSource: DataSource;

  @Output() onDisplayColumnsChange: EventEmitter<any> = new EventEmitter();

  columns: string[];
  display_columns: string[];

  constructor(
    private dataSourceService: DataSourceService
  ){}

  // onChange(what: string){
  //     switch(what){
  //       case 'display_columns':
  //         this.onDisplayColumnsChange.emit(this.display_columns)
  //     }
  // }

  isSelected(item: string){
      return this.dataSource.display_columns.indexOf(item) != -1;
  }

}

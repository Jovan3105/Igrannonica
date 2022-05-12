import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HeaderDict, TableIndicator } from '../../models/table_models';
import { HeadersService } from '../../services/headers.service';
import { ShowTableComponent } from '../show-table/show-table.component';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  @ViewChild('numIndicators') private numIndicators!: ShowTableComponent;
  @ViewChild('catIndicators') private catIndicators!: ShowTableComponent;
  @ViewChild('basicInfo') private basicInfo!:ShowTableComponent;
  corrMatrixSource: any;

  constructor(private headersService:HeadersService, private domSanitizer: DomSanitizer) { }

  ngOnInit(): void 
  {
  }

  showTables(response:any)
  {
    var headerContinuous = this.headersService.getInfoStatsHeader(response['continuous']);
    this.numIndicators.setPaginationEnabled(false);
    this.numIndicators.setTableStyle("height: 400px;");
    this.numIndicators.prepareTable(TableIndicator.STATS, response['continuous'], headerContinuous);

    var headerCategorical = this.headersService.getInfoStatsHeader(response['categorical']);
    this.catIndicators.setPaginationEnabled(false);
    this.catIndicators.setTableStyle("height: 250px;");
    this.catIndicators.prepareTable(TableIndicator.STATS, response['categorical'], headerCategorical);
  }
  showMatrix(response:any)
  {
    this.corrMatrixSource = this.domSanitizer.bypassSecurityTrustUrl(response);
  }
  showInfo(response:any)
  {
    console.log(response);
    this.basicInfo.setPaginationEnabled(false);
    this.basicInfo.setTableStyle("height: 100px;");
    var headerInfo = this.headersService.getInfoStatsHeader(response);
    this.basicInfo.prepareTable(TableIndicator.INFO, response, headerInfo) 
  }
}

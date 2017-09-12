import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['../documentation.component.scss']
})
export class IndicatorsComponent implements OnInit {

  data: any = [];
  constructor() { }

  ngOnInit() {

  	this.data = [
  					`var indicators = require('dride-indicators')`,
  					`indicators.startLoading();`,
  					`indicators.stopLoading();`
  	]
  }

}

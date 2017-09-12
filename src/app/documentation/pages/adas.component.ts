import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'docs-adas',
  templateUrl: './adas.component.html',
  styleUrls: ['../documentation.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdasComponent implements OnInit {

  constructor() { }
  data: any = [];
  ngOnInit() {



  	this.data = [
  	`var core = require('dride-core')`,
	  	`core.getRoad().then(function(res){
	console.log(res)	//{"topLeft": "40.556" ,"topRight": "48.441","bottomLeft": "251.11","bottomLeft": "1.44}
})`,
`core.getFrontCar().then(function(res){
	console.log(res)	//{"left": {"x": 80.156" : "y": 4.48"},"right": {"x": "71.18","y": "49.41}}
})`,
	  	`core.roadAngle().then(function(res){
	console.log(res)	//{"angle": "45.5"}
})`,
	  	`core.getSpeed().then(function(res){
	console.log(res)	//{"speed": "90", "unit": "mph"}
})`,
	  	`core.getCurrenPosition().then(function(res){
	console.log(res)	//{"lat": "34.54454", "lon": "30.488474"}
})`
	]








  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-publish',
  templateUrl: './publish.component.html',
  styleUrls: ['../documentation.component.scss']
})
export class PublishComponent implements OnInit {

  data: any = [];

  constructor() { }

  ngOnInit() {

  	  	this.data = [
  					`$ dride publish`
  		]

  }

}

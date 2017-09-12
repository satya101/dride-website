import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-assistant',
  templateUrl: './assistant.component.html',
  styleUrls: ['../documentation.component.scss']
})
export class AssistantComponent implements OnInit {

  data: any = [];

  constructor() { }

  ngOnInit() {
  		this.data = [
  			`var assistant = require('dride-alexa')`
  		]
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'hljs',
	template: `<div class="code-example">
					<pre><code>{{code}}</code></pre>
				</div>`,
	styles: [`code{
			    display: block;
			    overflow-x: auto;
			    padding: .5em;
			    color: #333;
			    background: #f8f8f8;
			    -webkit-text-size-adjust: none;
			}
			pre{
			    padding: 9.5px;
			    margin: 0 0 10px;
			    font-size: 13px;
			    word-break: break-all;
			    word-wrap: break-word;
			    background-color: #f5f5f5;
			    border: 1px solid #ccc;
			    border-radius: 4px;
			    font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
			    margin-top: 30px;
			    margin-bottom: 30px;

			}
			`]
})
export class CodeComponent implements OnInit {
	@Input() code: String;

	constructor() { }

	ngOnInit() {
	}

}

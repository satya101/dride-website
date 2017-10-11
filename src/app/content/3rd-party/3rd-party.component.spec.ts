import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TPartyComponent } from './3rd-party.component';

describe('FleetComponent', () => {
	let component: TPartyComponent;
	let fixture: ComponentFixture<TPartyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TPartyComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TPartyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});

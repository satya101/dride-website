import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerComponent } from './player.component';

describe('FooterComponent', () => {
	let component: PlayerComponent;
	let fixture: ComponentFixture<PlayerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PlayerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should be created', () => {
		expect(component).toBeTruthy();
	});
});
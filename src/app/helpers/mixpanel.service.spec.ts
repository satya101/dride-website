import { TestBed, inject } from '@angular/core/testing';

import { MixpanelService } from './mixpanel.service';

describe('MixpanelService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [MixpanelService]
		});
	});

	it('should be created', inject([MixpanelService], (service: MixpanelService) => {
		expect(service).toBeTruthy();
	}));
});

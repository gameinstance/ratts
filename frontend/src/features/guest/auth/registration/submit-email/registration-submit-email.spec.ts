import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationSubmitEmail } from './registration-submit-email';

describe('RegistrationSubmitEmail', () => {
	let component: SubmitEmail;
	let fixture: ComponentFixture<RegistrationSubmitEmail>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RegistrationSubmitEmail]
		})
		.compileComponents();

		fixture = TestBed.createComponent(RegistrationSubmitEmail);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationVerifyEmail } from './verify-email';

describe('RegistrationVerifyEmail', () => {
	let component: RegistrationVerifyEmail;
	let fixture: ComponentFixture<RegistrationVerifyEmail>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [RegistrationVerifyEmail]
		})
		.compileComponents();

		fixture = TestBed.createComponent(RegistrationVerifyEmail);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

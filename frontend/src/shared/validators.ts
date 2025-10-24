import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const value = control.value || '';
		const hasLetter = /[a-zA-Z]/.test(value);
		const hasNumber = /\d/.test(value);
		const valid = hasLetter && hasNumber;

		return valid ? null : { passwordStrength: true };
	};
}

export function passwordMatchValidator(): ValidatorFn {
	return (formGroup: AbstractControl): ValidationErrors | null => {
		const password = formGroup.get('password')?.value;
		const confirmPassword = formGroup.get('confirmPassword')?.value;

		return (password && confirmPassword && (password !== confirmPassword))?
							{ passwordsDoNotMatch: true } : null;
	};
}

import { AbstractControl } from '@angular/forms';

export function strongPassword(control: AbstractControl) {

	const minMaxLength = /^[\s\S]{8,}$/;
	const upper = /[A-Z]/;
	const lower = /[a-z]/;
	const number = /[0-9]/;
	// var special = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

	if (minMaxLength.test(control.value) &&
		upper.test(control.value) &&
		lower.test(control.value) &&
		number.test(control.value)) { // &&
		// !special.test(control.value)) {

		return null;
	}

	return { weakPassword: true };
}

import { AbstractControl, FormGroup } from '@angular/forms';

export function matchPassword(controlName: string, matchControlName: string) {
	return (group: FormGroup) => {

		const c = <AbstractControl>group.get(controlName);
		const mc = <AbstractControl>group.get(matchControlName);

		if (c.pristine || mc.pristine) {
			return null;
		}

		// Mark group as touched so we can add invalid class easily
		group.markAsTouched();

		if (c && mc && c.value === mc.value) {
			const mcErrors = mc.errors ? Object.assign({}, mc.errors) : null;
			if (mcErrors) {
				delete mcErrors['matchPassword'];
				mc.setErrors(Object.keys(mcErrors).length === 0 ? null : mcErrors);
			}

			return null;
		}

		const mcErrorz = Object.assign({}, mc.errors);
		mcErrorz.matchPassword = true;
		mc.setErrors(mcErrorz);

		return { matchPassword: false };
	};
}

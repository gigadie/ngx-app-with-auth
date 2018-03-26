export class UserProfile {
	id: number;
	firstName: string;
	lastName: string;
	fullName: string;
	email: string;
	gender: string;
	userType: string;
	imageUrl: string;
	lastSignedInDate: Date;
}

interface DictionaryItem<K, V> {
	0: K;
	1: V;
}

export class User {
	userProfile: UserProfile;
	features: string[];
	permissions: DictionaryItem<string, string[]>[];

	get isAdmin(): boolean { return this.userProfile.userType === 'Admin'; }

	hasAnyFeatures(): boolean {
		return 	this.features &&
				this.features.length > 0;
	}

	hasFeature(feature: string): boolean {
		feature = feature ? feature.trim() : null;

		return 	feature &&
				this.features &&
				this.features.includes(feature);
	}

	hasPermission(feature: string, permission: string): boolean {
		permission = permission ? permission.trim() : null;

		return 	permission &&
				this.permissions &&
				this.permissions[feature] &&
				this.permissions[feature].includes(permission);
	}
}

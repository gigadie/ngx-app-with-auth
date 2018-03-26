import { User, UserProfile } from '../app/data_models/userprofile.model';

export function getIdentityUtil() {
	const identityUser: UserProfile  = {
		id: 31,
		firstName: 'Chambers',
		lastName: 'Administrator',
		fullName: 'Chambers Administrator',
		email: 'user@chambersandpartners.com',
		gender: 'M',
		userType: 'Admin',
		imageUrl: '/path/to/person_profile_image',
		lastSignedInDate: new Date('2017-11-06')
	};

	const identity: User = {
		userProfile : identityUser,
		features: null,
		permissions: null,
		isAdmin: true,
		hasAnyFeatures: () => false,
		hasFeature: () => false,
		hasPermission: () => false
	};

	return identity;
}

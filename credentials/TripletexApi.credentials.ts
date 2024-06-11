import type {
	IAuthenticateGeneric,
	ICredentialDataDecryptedObject,
	ICredentialTestRequest,
	ICredentialType,
	IHttpRequestHelper,
	INodeProperties,
} from 'n8n-workflow';

export class TripletexApi implements ICredentialType {
	name = 'tripletexApi';
	displayName = 'Tripletex API';
	icon = 'file:tripletex.svg';
	documentationUrl = 'https://github.com/esselt/n8n-nodes-tripletex-credentials.git';
	genericAuth = true;

	properties: INodeProperties[] = [
		{
			displayName: 'Session Token',
			name: 'sessionToken',
			type: 'hidden',

			typeOptions: {
				expirable: true,
			},
			default: '',
		},
		{
			displayName: 'URL',
			name: 'url',
			type: 'hidden',
			default: 'https://tripletex.no/v2',
		},
		{
			displayName: 'Consumer Token',
			name: 'consumerToken',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Employee Token',
			name: 'employeeToken',
			type: 'string',
			default: '',
		},
	];

	// method will only be called if "sessionToken" (the expirable property)
	// is empty or is expired
	async preAuthentication(this: IHttpRequestHelper, credentials: ICredentialDataDecryptedObject) {
		// get date tomorrow
		const date = new Date();
		date.setDate(date.getDate() + 1);

		// make reques to get session token
		const { value: { token } } = (await this.helpers.httpRequest({
			method: 'PUT',
			url: `${credentials.url}/token/session/:create`,
			qs: {
				consumerToken: credentials.consumerToken,
				employeeToken: credentials.employeeToken,
				expirationDate: date.toISOString().substring(0, 10),
			},
		})) as { value: { token: string } };
		return { sessionToken: token };
	}

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '0',
				password: '={{$credentials.sessionToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials?.url}}',
			url: '/token/session/>whoAmI',
		},
	};
}

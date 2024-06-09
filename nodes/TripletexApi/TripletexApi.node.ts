import {
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class TripletexApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tripletex API',
		name: 'tripletexApi',
		group: [],
		version: 1,
		description: 'This node is only present to allow Tripletex API credentials to be installed',
		defaults: {
			name: 'Tripletex API',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [],
	};
}

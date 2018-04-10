import {
SET_LOCATIONS_TO_STATE,
SET_SINGLE_LOCATION_TO_STATE,
UNSET_SINGLE_LOCATION_FROM_STATE,
CLEAN_MY_LOCATIONS
} from '../actions/index';
import _ from 'lodash';
import {store} from '../index';

export default function(state = null, action) {
	switch(action.type){
		case SET_LOCATIONS_TO_STATE:
			console.log('SET_LOCATIONS_TO_STATE ', action.payload);
			return action.payload;
		case SET_SINGLE_LOCATION_TO_STATE:
		console.log('SET_SINGLE_LOCATION_TO_STATE ', state);
			return [...state, action.payload];
		case CLEAN_MY_LOCATIONS:
			return null;
		default:
			return state;
	}
}
import {SET_USER, CLEAN_USER_STATE} from '../actions/index';

export default function(state = {}, action) {
	switch(action.type){
		case SET_USER:
		console.log('action',action.payload);
			return action.payload;
		case CLEAN_USER_STATE:
			return null;
		default:
			return state;
	}
}
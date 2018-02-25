import { FETCH_WEATHER, CLEAN_STATE } from '../actions/index';

export default function(state = null, action) {
	switch(action.type){
		case FETCH_WEATHER:
			return action.payload.data.list;
		case CLEAN_STATE:
			return null;
		default:
			return state;
	}
}
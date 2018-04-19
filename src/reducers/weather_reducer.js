import { FETCH_WEATHER, CLEAN_WEATHER_STATE } from '../actions/index';

export default function(state = null, action) {
	switch(action.type){
		case FETCH_WEATHER:
			return action.payload.data.list;
		case CLEAN_WEATHER_STATE:
			return null;
		default:
			return state;
	}
}
import { FETCH_GEOLOCATION, CLEAN_STATE} from '../actions/index';

export default function(state = null, action) {
	switch(action.type){
		case FETCH_GEOLOCATION:
			if(action.payload !== undefined){
				console.log(action.payload);
				return action.payload;
			} else {
				return null;
			}
		case CLEAN_STATE:
			return null;
		default:
			return state;
	}
}


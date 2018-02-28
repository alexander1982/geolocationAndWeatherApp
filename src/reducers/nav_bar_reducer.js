import { TOGGLE_NAV_BAR } from '../actions/index';

export default function(state = false, action) {
	switch(action.type){
		case TOGGLE_NAV_BAR:
			return !state;
		default:
			return state;
	}

}
import {SET_USER, UNSET_USER} from '../actions/index';

export default function(state = {}, action) {
	console.log('sadasdasdasd ');
	switch(action.type){
		case SET_USER:
			console.log('sadasdasdasd ',action);
			return action.payload;
		case UNSET_USER:
			return {};
		default:
			return state;
	}
}
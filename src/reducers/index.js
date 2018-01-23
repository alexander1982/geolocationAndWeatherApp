import {combineReducers} from 'redux';
import geoReducer from './geolocation_reducer';

const rootReducer = combineReducers({
	location: geoReducer
                                    });

export default rootReducer;
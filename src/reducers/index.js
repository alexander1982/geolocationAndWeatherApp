import { combineReducers } from 'redux';
import locationReducer from './location_reducer';
import weatherReducer from './weather_reducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
	                                    location: locationReducer,
	                                    weather : weatherReducer,
	                                    form    : formReducer
                                    });

export default rootReducer;
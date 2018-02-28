import { combineReducers } from 'redux';
import locationReducer from './location_reducer';
import weatherReducer from './weather_reducer';
import modalReducer from './modal_reducer';
import navBarReducer from './nav_bar_reducer';
import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
	                                    toggleModal : modalReducer,
	                                    toggleNavBar: navBarReducer,
	                                    location    : locationReducer,
	                                    weather     : weatherReducer,
	                                    form        : formReducer
                                    });

export default rootReducer;
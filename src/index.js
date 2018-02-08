import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter,Route, Switch } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import logger from 'redux-logger';
import reducers from './reducers';

import GeoIndex from './components/geo_index';

const store = createStore(reducers, {}, applyMiddleware(ReduxPromise,logger));

import '../style/style.css';

ReactDOM.render(
	<Provider store={store}>
		<BrowserRouter>
			<div>
				<Switch>
					<Route path="/" component={GeoIndex}/>
				</Switch>
			</div>
		</BrowserRouter>
	</Provider>,
document.getElementById('app')
);


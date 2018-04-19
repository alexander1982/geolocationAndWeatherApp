import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { removeLocationFromMyLocations, fetchGeoLocation, cleanState } from '../actions/index';
import { store } from '../index';
import _ from 'lodash';
import uniqId from 'uniqid';

export class MyLocations extends Component {
	constructor(props) {
		super(props);
		this.generateKey = this.generateKey.bind(this);
		this.onRemove = this.onRemove.bind(this);
	}

	generateKey() {
		return uniqId();
	}

	formatUserLocations(locations) {
		let someArr = [];
		let count = 0;
		let val = {};
		_.map(locations, (value, akey) => {
			console.log('locationsArray___4', value);
			console.log('locationsArray___4', akey);
			for(let bkey in value){
				val = value[bkey];
				console.log('Val', val);
				console.log('count', count);
				someArr[count] = val;
				console.log('someArr', someArr);
			}
			count++;
		});
		return someArr;
	}

	onRemove(locationToRemove) {
	store.dispatch(this.props.removeLocationFromMyLocations(locationToRemove));
	}

	render() {
		if(this.props.userLocations && this.props.userLocations.length > 0){
			let formatted_locations = this.formatUserLocations(this.props.userLocations);
			console.log('this.state.userLocations ', this.props.userLocations);
			return (
			<div className="dropdown">
				<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
				        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Dropdown button
				</button>
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					{formatted_locations.map((value) => {
						console.log('Location', value);
						let specialKey_1 = this.generateKey();
						console.log('specialKey_1', specialKey_1);
						return (
						<div key={specialKey_1}>
					<span onClick={() => {
						store.dispatch(this.props.fetchGeoLocation({street: value.street, city: value.city, country: value.country}));
					}
					}>{value.formatted_address}</span>
					<span onClick={() => {
						this.onRemove({lat: value.lat, lng: value.lng, formatted_address: value.formatted_address});
					}}>{value.lat}</span>
						</div>
						)
					})}
				</div>
			</div>
			)
		} else {
			return (
			<div>No locations</div>
			);
		}
	}
}

export default connect(null, { removeLocationFromMyLocations, fetchGeoLocation, cleanState })(MyLocations);
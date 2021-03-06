import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeLocationFromMyLocations, fetchGeoLocation } from '../actions/index';
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
		_.map(locations, (value, a_key) => {
			for(let b_key in value){
				val = value[b_key];
				someArr[count] = val;
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
			return (
			<div className="dropdown" id="myLocationsContainer">
				<button className="btn-lg btn-block btn-primary_3 box-shadow-bright dropdown-toggle" type="button" id="dropdownMenuButton"
				        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					<span className="submit-inner-html button-text-shadow">My Locations</span>
				</button>
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					{formatted_locations.map((value) => {
						let specialKey_1 = this.generateKey();
						return (
						<div key={specialKey_1}>
					<span onClick={() => {
						store.dispatch(this.props.fetchGeoLocation({street: value.street, city: value.city, country: value.country}));
					}
					}>{value.formatted_address}</span>
					<span onClick={() => {
						this.onRemove({lat: value.lat, lng: value.lng, formatted_address: value.formatted_address});
					}}>X</span>
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

export default connect(null, { removeLocationFromMyLocations, fetchGeoLocation })(MyLocations);
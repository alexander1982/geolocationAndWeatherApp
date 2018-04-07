import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeLocationFromMyLocations, fetchGeoLocation, cleanState } from '../actions/index';
import { store } from '../index';
import CryptoJS from 'crypto-js';
import _ from 'lodash';

export class MyLocations extends Component {
	constructor(props) {
		super(props);

		this.state = { userLocations: null };
	}
	componentDidMount() {
			this.setState({
				              userLocations: this.props.userLocations
			              });
			console.log('From didMount', this.state.userLocations);

	}

	componentWillUpdate(nextProps, nextState) {
		console.log('nextProps ', nextProps);
		console.log('nextState ', nextState);
		if(nextState.userLocations !== this.state.userLocations) {
			this.setState({
				              userLocations: nextState.userLocations
			              });
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log('nextProps ',nextProps);
		if(nextProps.userLocations && this.state.userLocations !== nextProps.userLocations) {
			this.setState({
				              userLocations: nextProps.userLocations
			              });
		} else {
			this.setState({
				              userLocations: null
			              });
		}
			console.log('nextProps_1 ',nextProps);
	}

	add(a, b) {
		return a + b;
	}

	generateKey(address) {
		let newId = CryptoJS.AES.encrypt(address, 'secret key 123');
		let bytes = CryptoJS.AES.decrypt(newId.toString(), 'secret key 123');
		let sum = bytes.words.reduce(this.add, 0);
		return sum;
	}

	render() {

		if(this.state.userLocations !== null && this.state.userLocations.length){
			console.log('this.state.userLocations ',this.state.userLocations);
			let locationsArray = [];
			_.map(this.state.userLocations, (value, akey) => {
				for(let bkey in value) {
					locationsArray.push(value[bkey]);
				}
			});

			locationsArray = _.uniqBy(locationsArray, 'address');
console.log('locationsArray___4', locationsArray);
			return (
			<div className="dropdown">
				<button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
				        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
					Dropdown button
				</button>
				<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
					{locationsArray.map((value) => {
						console.log('Location', value);

						let specialKey_2 = this.generateKey(value.address);
						let specialKey_3 = specialKey_2 + 324;
						return (
						<div key={specialKey_3}>
					<span href="#" key={value.address} onClick={() => {
						console.log('A');
						store.dispatch(this.props.fetchGeoLocation({street: value.street, city: value.city, country: value.country}));
					}
					}>{value.address}</span>
					<span key={specialKey_2} onClick={() => {
						console.log('B', value.lat);
						this.props.removeLocationFromMyLocations({lat: value.lat, lng: value.lng});
					}}>{value.lat}</span>
						</div>
						)
				})}
				</div>
			</div>
			)
		} else {
			return null;
		}
	}
}

//function mapStatToProps({ userLocations }) {
//	return { userLocations }
//}

export default connect(null, { removeLocationFromMyLocations, fetchGeoLocation, cleanState })(MyLocations);
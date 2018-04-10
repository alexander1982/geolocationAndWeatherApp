import React, { Component } from 'react';
import { connect } from 'react-redux';
import { removeLocationFromMyLocations, fetchGeoLocation, cleanState } from '../actions/index';
import { store } from '../index';
import CryptoJS from 'crypto-js';
import _ from 'lodash';
import uniqeId from 'uniqid';

export class MyLocations extends Component {
	constructor(props) {
		super(props);

		this.state = { userLocations: null };
		this.generateKey = this.generateKey.bind(this);
		this.onRemove = this.onRemove.bind(this);
	}

	componentDidMount() {
		if(this.props.userLocations){
			this.setState({
				              userLocations: this.props.userLocations
			              });
			console.log('From didMount', this.state.userLocations);
		}
	}

	componentWillUpdate(nextProps, nextState) {
		console.log('nextProps ', nextProps);
		console.log('nextState ', nextState);
		if(nextState.userLocations !== this.state.userLocations){
			this.setState({
				              userLocations: nextState.userLocations
			              });
		}
	}

	componentWillReceiveProps(nextProps) {
		console.log('nextProps ', nextProps);
		if(nextProps.userLocations && this.state.userLocations !== nextProps.userLocations){
			this.setState({
				              userLocations: nextProps.userLocations
			              });
		}
		console.log('nextProps_1 ', nextProps);
	}
	
	generateKey() {
		return uniqeId();
	}

	onRemove(params) {
		console.log('this ', this);
		let newState = this.state;
		let index = null;
		let someArr = [];
		console.log('zzzzz', newState.userLocations);
		_.map(newState.userLocations, (value, akey) => {
			someArr.push(value);
			for(let dkey in value) {
				console.log('dkey', dkey);
				console.log('value', value[dkey]);
				index = someArr.indexOf(value);
				console.log('index', index);
				if(value[dkey].address === params.address){
					console.log('value', value[dkey].address);
					console.log('value', params.address);
					console.log('index', index);
					console.log('newState.userLocations',newState.userLocations);
				}
					if(index === -1) return;
        index = index + 1;
				console.log('index ',index);
				newState.userLocations = newState.userLocations.splice(index, 1);

				console.log('Me_1 ', newState.userLocations);
					if(newState.userLocations.length) {
						console.log('Me_2');
						this.setState({
							              userLocations: newState.userLocations
						              });
						//this.props.removeLocationFromMyLocations({lat: params.lat, lng: params.lng});
					} else {
						console.log('Me_3');

						this.setState({
							              userLocations: null
						              });
						this.props.removeLocationFromMyLocations({lat: params.lat, lng: params.lng});
					}

			}
		});
		console.log('this.props.remove', params);

	}

	render() {
		console.log('locationsArray__33', this.state.userLocations);
		if(this.state.userLocations && this.state.userLocations !== null && this.state.userLocations.length){
			console.log('this.state.userLocations ', this.state.userLocations);
			let locationsArray = [];
			let someArr = [];
			_.map(this.state.userLocations, (value, akey) => {
				someArr = value[akey];
				console.log('locationsArray___4', value);
				console.log('locationsArray___4', akey);
				for(let bkey in value){
					//if(!value[bkey].lat){
					//	console.log('no');
					//	return null;
					//}
					console.log('bkey', bkey);
					console.log('bkey', value[bkey]);
					locationsArray.push(value[bkey]);
				}
			});

			//locationsArray = _.uniqBy(locationsArray, 'address');
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
						let specialKey_1 = this.generateKey();
						console.log('specialKey_1', specialKey_1);
						return (
						<div key={specialKey_1} id={value.address}>
					<span onClick={() => {
						console.log('A');
						store.dispatch(this.props.fetchGeoLocation({street: value.street, city: value.city, country: value.country}));
					}
					}>{value.address}</span>
					<span onClick={() => {
						console.log('B', this);
						this.onRemove({lat: value.lat, lng: value.lng});
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
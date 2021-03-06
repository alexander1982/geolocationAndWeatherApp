import React, { Component } from 'react';
import { connect } from 'react-redux';
import { store } from '../index';
import { cleanState, fetchGeoLocation, fetchWeather, setLocationToMyLocations, signIn, signOut, toggleModalAction, toggleNavBarAction } from '../actions/index';

import GoogleMap from './google_map';
import WeatherInfo from '../containers/weatherInfo';
import WeatherChart from './weather_chart';
import SearchNew from './search_new';
import NavBar from './nav_bar';
import MyLocations from '../containers/my_locations';

import $ from 'jquery';

class GeoIndex extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userLocations: null
		}
	}

	componentDidMount() {
		if(this.props.userLocations){
			this.setState({
				              userLocations: this.props.userLocations
			              });
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.userLocations !== this.state.userLocations){
			this.setState({
				              userLocations: nextProps.userLocations,
				              location     : nextProps.location
			              });
		}
	}

	toggleModalHere() {
		this.props.toggleModalAction();
	}

	renderModal() {
		$('body').
		append('<button id="modalButton" type="button" className="btn btn-primary btn-lg display-none" data-toggle="modal" data-target="#modalContainer"/>');
		$('#modalButton').click();
	}

	renderMap() {
		if(this.props.toggleModal === true){
			this.renderModal();
			this.props.cleanState();
		}

		if(this.props.location == null || !(this.props.location instanceof Object) || !this.props.location.data || this.props.location.data.status !== 'OK'){
			return (
			<div className="box-shadow-bright">
				<img className="img-fluid gif-margin" src="http://cdn.ebaumsworld.com/mediaFiles/picture/416301/83779543.gif"/>
			</div>
			)
		} else {
			console.log('this.props.location.GoogleMap', this.props.location);
			return (
			<GoogleMap location={this.props.location} className="box-shadow-bright"/>
			)
		}
	}

	renderWeatherInfo() {
		if(this.props.weather){
			return (
			<WeatherInfo weather={this.props.weather}/>
			)
		}
		return null;
	}

	renderChart() {
		if(this.props.weather){
			return (
			<WeatherChart weather={this.props.weather}/>
			)
		}
		return null;
	}

	renderMyLocations() {
		if(this.state.userLocations && this.state.userLocations.length > 0){
			return (
			<MyLocations userLocations={this.state.userLocations}/>
			)
		}
		return null;
	}

	renderSignInLogout() {
		if(this.props.localUser.email) {
			return (
			<button onClick={() => {this.props.signOut()}} className="btn-lg btn-block btn-primary_2 box-shadow-bright"><span className="submit-inner-html button-text-shadow">Sign Out</span></button>
			)
		} else {
			return (
			<button onClick={() => {this.props.signIn()}} className="btn-lg btn-block btn-primary_2 box-shadow-bright"><span className="submit-inner-html button-text-shadow">Sign In</span></button>
			)
		}
	}

	render() {
		return (
		<div className="container-fluid" id="geoIndexContainer">

			<div className="row">
				<div className="col-sm-12 col-lg-12 hidden-xs-down col-up-spacer">

				</div>
			</div>
			<div className="row">

				<div className="col-sm-3 col-lg-3 hidden-lg-down"></div>

				<div className="col-sm-2 col-12 hidden-sm-up" id="navBarContainer">
					<NavBar/>
				</div>

				<div className="col-sm-4 col-lg-2 col-12 hidden-xs-down search-width">
					<SearchNew/>
				</div>
				<div className="col-sm-8 col-lg-4 col-12 column-mutual-css map-width">
					<div className="col-sm-12 col-lg-12 col-12 column-mutual-css padding-bottom-1rem">
						<div className="btn-group btn-group-sm" role="group" >
							{this.renderMyLocations()}
						</div>
						<div className="btn-group btn-group-sm float-right" role="group" >
							{this.renderSignInLogout()}
						</div>
					</div>
					{this.renderMap()}
				</div>

				<div className="col-sm-12 col-lg-12 col-12">
					<div className="row">
						<div className="col-sm-3 col-lg-3 hidden-lg-down">

						</div>
						<div className="col-sm-6 col-lg-3 col-12 column-mutual-css weather-info chart-and-graph-background-left">
							{this.renderWeatherInfo()}
						</div>

						<div className="col-sm-6 col-lg-3 col-12 column-mutual-css weather-info chart-and-graph-background-right">
							{this.renderChart()}
						</div>
					</div>
				</div>
			</div>

			<div className="modal fade" id="modalContainer" tabIndex="-1" role="dialog"
			     aria-labelledby="modalContainer" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLongTitle">Cant find the location</h5>
						</div>
						<div className="modal-body">
							<h6>Please check the names of Street, City and Country.</h6>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" data-dismiss="modal"
							        onClick={this.toggleModalHere.bind(this)}>
								Close
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		)
	}
}
function mapStateToProps({ location, weather, form, toggleModal, toggleNavBar, userLocations, localUser }) {
	return { location, weather, form, toggleModal, toggleNavBar, userLocations, localUser };
}

export default connect(mapStateToProps, { cleanState, fetchGeoLocation, fetchWeather, setLocationToMyLocations, signIn, signOut, toggleModalAction, toggleNavBarAction })(GeoIndex);
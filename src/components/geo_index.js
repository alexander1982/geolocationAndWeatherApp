import React, { Component } from 'react';
import { connect } from 'react-redux';
import {store} from '../index';
import { cleanState, fetchGeoLocation, toggleModalAction, toggleNavBarAction } from '../actions/index';

import tapOrClick from 'react-tap-or-click';

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
	}

	toggleModalHere() {
		this.props.toggleModalAction();
	}

	renderModal() {
		$('body').
		append('<button id="modalButton" type="button" className="btn btn-primary btn-lg display-none" data-toggle="modal" data-target="#exampleModalCenter"/>');
		$('#modalButton').click();
	}

	renderMap() {
		if(this.props.toggleModal === true){
			this.renderModal();
			this.props.cleanState();
		}

		if(!(this.props.location instanceof Object) || this.props.location == null){
			console.log('this.props.location', this.props.location);
			return (
			<div>
				<img className="img-fluid gif-margin" src="http://cdn.ebaumsworld.com/mediaFiles/picture/416301/83779543.gif"/>
			</div>
			)
		} else {
			return (<GoogleMap />)
		}

	}

	renderWeatherInfo() {
		if(this.props.location instanceof Object && this.props.location !== null && this.props.location.data && this.props.location.data.results && this.props.location.data.results.length){
			return (
			<WeatherInfo weather={this.props.weather}/>
			)
		}
		return (
		<div></div>
		)
	}

	renderChart() {
		if(this.props.location && this.props.location !== null && this.props.location.data && this.props.location.data.status !== 'ZERO_RESULTS'){
			return (
			<WeatherChart weather={this.props.weather}/>
			)
		}
		return (
		<div></div>
		)
	}

	renderMyLocations() {
		if(this.props.localUser !== null && this.props.userLocations !== null && this.props.userLocations.length){
			return (
			<MyLocations userLocations={this.props.userLocations}/>
			)
		} else {
			return (
			<div>No Locations yet</div>
			)
		}
	}

	render() {

		return (
		<div className="container-fluid">

			<div className="row">
				<div className="col-sm-12 col-lg-12 hidden-xs-down col-up-spacer">

				</div>
			</div>
			<div className="row">
				<div className="col-sm-3 col-lg-3 hidden-lg-down">

				</div>
				<div className="col-sm-2 col-12 hidden-sm-up" id="navBarContainer">
					<NavBar/>
				</div>
				<div className="col-sm-4 col-lg-2 col-12 hidden-xs-down form-width search-width">
					<SearchNew/>
				</div>
				<div className="col-sm-8 col-lg-4 col-12 column-mutual-css map-width">
					{this.renderMyLocations()}
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

			<div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog"
			     aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<div className="modal-dialog modal-dialog-centered" role="document">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title" id="exampleModalLongTitle">Cant find the location</h5>
						</div>
						<div className="modal-body">
							<h6>Please check the names of Street, City and Country.</h6>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={this.toggleModalHere.bind(this)}>
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

export default connect(mapStateToProps, {  cleanState, fetchGeoLocation, toggleModalAction, toggleNavBarAction })(GeoIndex);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGeoLocation, toggleModalAction } from '../actions/index';

import GoogleMap from './google_map';
import WeatherInfo from '../containers/weatherInfo';
import WeatherChart from './weather_chart';
import SearchNew from './search_new';
import NavBar from './nav_bar';

import $ from 'jquery';

class GeoIndex extends Component {
	renderModal() {
		$('body').append('<button id="modalButton" type="button" class="btn btn-primary btn-lg display-none" data-toggle="modal" data-target="#exampleModalCenter"/>');
		$('#modalButton').click();
	}

	renderMap() {
		console.log(this.props.location);
		if(this.props.location.data == null){
			return (
			<div>
				<img className="img-fluid gif-margin" src="http://cdn.ebaumsworld.com/mediaFiles/picture/416301/83779543.gif"/>
			</div>
			)
		}

		if(this.props.toggleModal === true) {
			this.renderModal();
		}



		if(this.props.location.data.results.length) {
			return (<GoogleMap />)
		} else {
			return (
			<div>
				<img className="img-fluid gif-margin" src="http://cdn.ebaumsworld.com/mediaFiles/picture/416301/83779543.gif"/>
			</div>
			)
		}

	}
	renderWeatherInfo(){
		if(this.props.location.data && this.props.location.data.results && this.props.location.data.results.length) {
			return (
			<WeatherInfo weather={this.props.weather}/>
			)
		}
		return (
		<div></div>
		)
	}
	renderChart(){
		if(this.props.location.data && this.props.location.data.results && this.props.location.data.results.length) {
			return (
			<WeatherChart weather={this.props.weather}/>
			)
		}
		return (
		<div></div>
		)
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
				<div className="col-sm-2 col-12 hidden-sm-up">
					<NavBar/>
				</div>
				<div className="col-sm-4 col-lg-2 col-12 hidden-xs-down form-width search-width">
					<SearchNew/>
				</div>
				<div className="col-sm-8 col-lg-4 col-12 column-mutual-css map-width">
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
							<button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => {
							this.props.toggleModalAction();
							}}>Close</button>
						</div>
					</div>
				</div>
			</div>

		</div>

		)
	}
}
function mapStateToProps({ location, weather, form, toggleModal }) {
	return { location, weather, form, toggleModal };
}

export default connect(mapStateToProps, { fetchGeoLocation, toggleModalAction })(GeoIndex);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchGeoLocation, fetchWeather } from '../actions/index';

import GoogleMap from './google_map';
import WeatherInfo from '../containers/weatherInfo';
import WeatherChart from './weather_chart';
import SearchNew from './search_new';
import NavBar from './nav_bar';

class GeoIndex extends Component {
	renderMap() {
		if(this.props.location.lat == null){
			return (<div>
				<img className="img-fluid gif-margin" src="http://cdn.ebaumsworld.com/mediaFiles/picture/416301/83779543.gif"/>
			</div>)
		}
		return (<GoogleMap lat={this.props.location.lat} lng={this.props.location.lng}/>)
	}

	render() {
		if(!this.props.weather){
			this.props.fetchWeather(this.props.location);
		}

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
							<WeatherInfo weather={this.props.weather}/>
						</div>

						<div className="col-sm-6 col-lg-3 col-12 column-mutual-css weather-info chart-and-graph-background-right">
							<WeatherChart weather={this.props.weather}/>
						</div>
					</div>
				</div>
			</div>

		</div>

		)
	}
}
function mapStateToProps({ location, weather }) {
	return { location, weather };
}

export default connect(mapStateToProps, { fetchGeoLocation, fetchWeather })(GeoIndex);
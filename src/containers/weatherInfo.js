import React, { Component } from 'react';
const path = require('path');

const day_clear_sky = path.resolve(__dirname, 'assets/images/day_clear_sky.png');
const day_broken_clouds = path.resolve(__dirname, 'assets/images/day_broken_clouds.png');
const day_few_clouds = path.resolve(__dirname, 'assets/images/day_few_clouds.png');
const day_rain = path.resolve(__dirname, 'assets/images/day_rain.png');
const day_scattered_clouds = path.resolve(__dirname, 'assets/images/day_scattered_clouds.png');
const day_shower_rain = path.resolve(__dirname, 'assets/images/day_shower_rain.png');
const day_snow = path.resolve(__dirname, 'assets/images/day_snow.png');
const day_thunder_storm = path.resolve(__dirname, 'assets/images/day_thunder_storm.png');
const day_light_snow = path.resolve(__dirname, 'assets/images/day_light_snow.png');


console.log('From weatherInfo ',__dirname);
class RenderGraph extends Component {
	constructor(props) {
		super(props);
		this.state = { weather: null }
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.weather !== this.state.weather){
			this.setState({ weather: nextProps.weather });
		}
	}

	renderWeatherImage() {
		switch(this.state.weather[0].weather[0].description){
			case 'clear sky':
				return day_clear_sky;
			case 'few clouds':
				return day_few_clouds;
			case 'scattered clouds':
				return day_scattered_clouds;
			case 'broken clouds':
				return day_broken_clouds;
			case 'shower rain':
				return day_shower_rain;
			case 'rain':
				return day_rain;
			case 'thunderstorm':
				return day_thunder_storm;
			case 'snow':
				return day_snow;
			case 'light snow':
				return day_light_snow;
			default:
				console.log('no');
				return 'no';
		}
	}

	render() {
		if(this.state.weather === null){
			return (
			<div className="graph"></div>
			)
		}

		const weatherImage = this.renderWeatherImage();

		return (
		<div className="row graph">
			<div className="col-lg-8 col-sm-8 col-8">

				<div className="col-sm-12 col-lg-12 col-12 search-margin">
					<small className="h3 text-muted text-font-size">Weather:</small>
					<span>{this.state.weather[0].weather[0].description}</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin">
					<small className="h3 text-muted text-font-size">Temperature:</small>
					<span>{this.state.weather[0].main.temp}</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin">
					<small className="h3 text-muted text-font-size">Wind:</small>
					<span>{this.state.weather[0].wind.speed}</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin">
					<small className="h3 text-muted text-font-size">Humidity:</small>
					<span>{this.state.weather[0].main.humidity}</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin">
					<small className="h3 text-muted text-font-size">Pressure:</small>
					<span>{this.state.weather[0].main.pressure}</span>
				</div>
			</div>

			<div className="col-lg-4 col-sm-4 col-4 text-center" id="weather-thumbnail">
				<img src={weatherImage}
				     className="img-fluid img-thumbnail"/>
			</div>
		</div>
		)
	}
}

export default RenderGraph;
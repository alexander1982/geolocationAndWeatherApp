import React, { Component } from 'react';
const path = require('path');

const day_clear_sky = './images/day_clear_sky.png';
const day_broken_clouds = './images/day_broken_clouds.png';
const day_few_clouds = './images/day_few_clouds.png';
const day_rain = './images/day_rain.png';
const day_scattered_clouds = './images/day_scattered_clouds.png';
const day_shower_rain = './images/day_shower_rain.png';
const day_snow = './images/day_snow.png';
const day_thunder_storm = './images/day_thunder_storm.png';
const day_light_snow = './images/day_light_snow.png';
const overcast_clouds = './images/overcast_clouds.png';


console.log('From weatherInfo ','./overcast_clouds.png');
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
			case 'overcast clouds':
				return overcast_clouds;
			case 'light rain':
				return overcast_clouds;
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
    const nowTemperature = Math.floor(this.state.weather[0].main.temp -273.15);

		return (
		<div className="row graph">
			<div className="col-lg-8 col-sm-8 col-8 no-padding padding-top-1rem">

				<div className="col-sm-12 col-lg-12 col-12 search-margin no-padding">
					<label className="text-font-size"><h6 className="weather-info-h6">Weather:</h6></label>
					<span className="now-weather">{this.state.weather[0].weather[0].description}</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin no-padding">
					<label className="text-font-size"><h6 className="weather-info-h6">Temperature:</h6></label>
					<span className="now-weather">{nowTemperature}C&#176;</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin no-padding">
					<label className="text-font-size"><h6 className="weather-info-h6">Wind:</h6></label>
					<span className="now-weather">{this.state.weather[0].wind.speed}m/s</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin no-padding">
					<label className="h6 text-font-size"><h6 className="weather-info-h6">Humidity:</h6></label>
					<span className="now-weather">{this.state.weather[0].main.humidity}%</span>
				</div>
				<div className="col-sm-12 col-lg-12 col-12 search-margin no-padding">
					<label className="text-font-size"><h6 className="weather-info-h6">Pressure:</h6></label>
					<span className="now-weather">{this.state.weather[0].main.pressure}hpa</span>
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
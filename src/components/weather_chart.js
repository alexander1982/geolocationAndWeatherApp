import React, { Component } from 'react';
const Chart = require('chart.js');
const Moment = require('moment');
import {connect} from 'react-redux';

class WeatherChart extends Component {
constructor(props) {
	super(props);

	this.state = {
		weatherData: []
	};
}
	componentWillReceiveProps(nextProps) {
		console.log('Received props');
		if(nextProps.weather !== this.state.weatherData) {
			this.setState({
				weatherData: nextProps.weather
			              })
		}
	}

	renderTheChart(temps, hours) {
		const ctx = document.getElementById("myChart").getContext('2d');
		var myChart = new Chart(ctx, {
			type   : 'bar',
			data   : {
				labels  : hours,
				datasets: [
					{
						label          : 'Temperature For Five Days',
						data           : temps,
						backgroundColor: 'rgba(68,141,201,1)',
						borderColor    : 'rgba(68,141,201,1)',
						borderWidth    : 3
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				legend             : {
					display: true,
					labels : {
						fontColor: '#ffff'
					}
				},
				scales             : {
					yAxes: [
						{
							display  : true,
							ticks    : {
								beginAtZero: true,
								fontSize   : 15,
								fontColor  : '#ffff'
							},
							gridLines: {
								display: true,
								color  : "#505050"
							}
						}
					],
					xAxes: [
						{
							display  : true,
							ticks    : {
								fontColor: '#ffff'
							},
							gridLines: {
								display: true,
								color  : "#505050"
							}
						}

					]
				}
			}
		});
	}

	render() {
console.log(this.state.weatherData);
		if(this.props.weather !== null){
			const temps = this.state.weatherData.map(day => day.main.temp - 273.15);
			const daysOfTheWeek = this.state.weatherData.map(day => {
				let formattedDaytesOfTheWeek = Moment.unix(day.dt).format('Do');

				return formattedDaytesOfTheWeek;
			});

			this.renderTheChart(temps, daysOfTheWeek);
		}
		return (
		<canvas id="myChart" ref="myChart"></canvas>
		)
	}
}

function mpStateToProps({weather}) {
	return {weather}
}

export default connect(mpStateToProps, null)(WeatherChart);
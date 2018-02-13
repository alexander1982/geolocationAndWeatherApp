import React, { Component } from 'react';
const Chart = require('chart.js');
const Moment = require('moment');

class WeatherChart extends Component {

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
						backgroundColor: 'rgba(214,240,255,1)',
						borderColor    : 'rgba(68,141,201,1)',
						borderWidth    : 3
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				scales             : {
					yAxes: [
						{
							display: true,
							ticks  : {
								beginAtZero: true,
								fontSize   : 15
							}
						}
					]
				}
			}
		});
	}

	render() {

		if(this.props.weather !== null){
			console.log(this.props.weather);
			const temps = this.props.weather.map(day => day.main.temp - 273.15);
			const daysOfTheWeek = this.props.weather.map(day => {
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

export default WeatherChart;
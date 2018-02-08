import React, { Component } from 'react';
const Chart = require('chart.js');

class WeatherChart extends Component {

	renderTheChart(temps, hours) {

		const ctx = document.getElementById("myChart").getContext('2d');
		var myChart = new Chart(ctx, {
			type   : 'line',
			data   : {
				labels  : hours,
				datasets: [
					{
						label          : 'Hourly for five days',
						data           : temps,
						backgroundColor: [
							'rgba(255, 206, 86, 0.7)',
							'rgba(75, 192, 192, 0.7)',
							'rgba(153, 102, 255, 0.7)',
							'rgba(255, 159, 64, 0.7)'
						],
						borderColor    : [
							'rgba(255,99,132,1)',
							'rgba(54, 162, 235, 1)',
							'rgba(255, 206, 86, 1)',
							'rgba(75, 192, 192, 1)',
							'rgba(153, 102, 255, 1)',
							'rgba(255, 159, 64, 1)'
						],
						borderWidth    : 3
					}
				]
			},
			options: {
				maintainAspectRatio: false,
				scales: {
					yAxes: [
						{
							display: true,
							ticks: {
								beginAtZero: true,
								fontSize: 15
							}
						}
					]
				}
			}
		});
	}

	render() {
		if(this.props.weather !== null){
			const temps = this.props.weather.map(day => day.main.temp);
			const hours = this.props.weather.map(day => {
				const processedHour = day.dt_txt.substr(11, 12);
				return processedHour.substr(0,2);
			});
			let processedHours = hours.filter(hour => {
				if(hours.indexOf(hour) % 4 == 0){
					return hour;
				}
			});

			this.renderTheChart(temps,processedHours);
		}
		return (
		<canvas id="myChart" ref="myChart"></canvas>
		)
	}
}

export default WeatherChart;
import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

const Chart = require('chart.js');
const Moment = require('moment');

class WeatherChart extends Component {
	componentDidMount() {
		if(this.props.weather){
			const temps = this.props.weather.map(day => day.main.temp - 273.15);
			const daysOfTheWeek = this.props.weather.map(day => Moment.unix(day.dt).format('Do'));
			$('document').ready(() => {
				const ctx = document.getElementById("myChart").getContext('2d');
				let myChart = new Chart(ctx, {
					type   : 'bar',
					data   : {
						labels  : daysOfTheWeek,
						datasets: [
							{
								label          : 'Temperature For Five Days',
								data           : temps,
								backgroundColor: '#ffff',
								borderColor    : 'rgba(1, 33, 81, 1)',
								borderWidth    : 2
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
			})
		}
	}

	componentWillReceiveProps(nextProps) {
		if(this.props.weather){
			const temps = nextProps.weather.map(day => day.main.temp - 273.15);
			const daysOfTheWeek = nextProps.weather.map(day => Moment.unix(day.dt).format('Do'));
			$('document').ready(() => {
				const ctx = document.getElementById("myChart").getContext('2d');
				let myChart = new Chart(ctx, {
					type   : 'bar',
					data   : {
						labels  : daysOfTheWeek,
						datasets: [
							{
								label          : 'Temperature For Five Days',
								data           : temps,
								backgroundColor: '#ffff',
								borderColor    : 'rgba(1, 33, 81, 1)',
								borderWidth    : 2
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
			})
		}
	}

	render() {
		return (
		<canvas id="myChart" ref="myChart"></canvas>
		)
	}
}
export default connect()(WeatherChart);
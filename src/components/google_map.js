import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeather } from '../actions/index';
class GoogleMap extends Component {
	constructor(props) {
		super(props);

		this.state = {
			locationData: {}
		};
	}

	componentWillReceiveProps(nextProps) {
		console.log('zdadasdsad',nextProps.location.data);
		if(nextProps.location.data.results[0].geometry.location !== this.state.locationData) {
			this.setState({
				              locationData: nextProps.location.data.results[0].geometry.location
			              });

			let lat = parseFloat(nextProps.location.data.results[0].geometry.location.lat);
			let lng = parseFloat(nextProps.location.data.results[0].geometry.location.lng);

			this.map.panTo({ lat: lat, lng: lng });
			this.props.fetchWeather({ lat: lat, lng: lng });

			this.panorama = new google.maps.StreetViewPanorama(
			document.getElementById('map'), {
				position: { lat: lat, lng: lng },
				pov     : {
					heading: -60,
					pitch  : 10
				}
			});
			this.map.setStreetView(this.panorama);
		}

	}

	componentDidMount() {
		this.setState({
			              locationData: this.props.location.data.results[0].geometry.location
		              });

		let lat = parseFloat(this.props.location.data.results[0].geometry.location.lat);
		let lng = parseFloat(this.props.location.data.results[0].geometry.location.lng);

		console.log('saadsad',this.state.locationData);
		this.props.fetchWeather({lat, lng});
		this.map = new google.maps.Map(this.refs.map, {
			zoom  : 16,
			center: { lat: lat, lng: lng }
		});

		this.marker = new google.maps.Marker({
			position: { lat: lat, lng: lng },
			map     : this.map,
			title   : 'You'
		});
		this.panorama = new google.maps.StreetViewPanorama(
		document.getElementById('map'), {
			position: { lat: lat, lng: lng },
			pov     : {
				heading: 34,
				pitch  : 10
			}
		});
		this.map.setStreetView(this.panorama);
	}

	render() {
		return <div id="map" className="map" ref="map"></div>
	}
}

function mapStateToProps({location}) {
	return {location};
}

export default connect(mapStateToProps, { fetchWeather })(GoogleMap);

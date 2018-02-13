import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchWeather } from '../actions/index';
class GoogleMap extends Component {
	componentDidMount() {

		this.map = new google.maps.Map(this.refs.map, {
			zoom  : 16,
			center: { lat: this.props.lat, lng: this.props.lng }
		});

		this.marker = new google.maps.Marker({
			position: { lat: this.props.lat, lng: this.props.lng },
			map     : this.map,
			title   : 'You'
		});
		this.panorama = new google.maps.StreetViewPanorama(
		document.getElementById('map'), {
			position: { lat: this.props.lat, lng: this.props.lng },
			pov     : {
				heading: 34,
				pitch  : 10
			}
		});
		this.map.setStreetView(this.panorama);
	}

	componentWillReceiveProps(nextProps) {
		this.map.panTo({ lat: nextProps.lat, lng: nextProps.lng });
		this.props.fetchWeather({ lat: nextProps.lat, lng: nextProps.lng });

		this.panorama = new google.maps.StreetViewPanorama(
		document.getElementById('map'), {
			position: { lat: nextProps.lat, lng: nextProps.lng },
			pov     : {
				heading: -60,
				pitch  : 10
			}
		});
		this.map.setStreetView(this.panorama);
	}

	render() {
		return <div id="map" className="map" ref="map"></div>
	}
}

export default connect(null, { fetchWeather })(GoogleMap);

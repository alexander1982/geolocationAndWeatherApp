import React, { Component } from 'react';
import {connect} from 'react-redux';
import {fetchWeather} from '../actions/index';
class GoogleMap extends Component {
	componentDidMount() {

		this.map = new google.maps.Map(this.refs.map, {
			zoom  : 16,
			center: { lat: this.props.lat, lng: this.props.lng }
		});

		new google.maps.Marker({
			position: { lat: this.props.lat, lng: this.props.lng },
			map     : this.map,
			title   : 'You'
		});
	}

	componentWillReceiveProps(nextProps) {
		this.map.panTo({lat: nextProps.lat, lng: nextProps.lng});
		this.props.fetchWeather({lat: nextProps.lat, lng: nextProps.lng});
		new google.maps.Marker({
			position: { lat: nextProps, lng: nextProps.lng },
			map     : this.map,
			title   : 'You'
		});
	}

	render() {
		return <div id="map" className="map" ref="map"></div>
	}
}

export default connect(null, {fetchWeather})(GoogleMap);

import React, { Component } from 'react';
import { connect } from 'react-redux';

class GoogleMap extends Component {
	constructor(props) {
		super(props);
		//this.state = {
		//	location: null
		//}
	}

	componentDidMount() {
		console.log('from componentDidMount');
		if(this.props.location){
			this.renderThisMap(this.props.location);
			//this.setState({
			//	              location: this.props.location
			//              })
		}
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.location){
			this.renderThisMap(nextProps.location);
		//	this.setState({
		//		location: nextProps.location
		//	              })
		}
	}

	renderThisMap(geometry){
		let lat = parseFloat(geometry.lat);
		let lng = parseFloat(geometry.lng);

		let map = new google.maps.Map(document.getElementById('map'), {
			center: { lat: lat, lng: lng },
			zoom: 14
		});
		
		let panorama = new google.maps.StreetViewPanorama(
		document.getElementById('map'), {
			position: { lat: lat, lng: lng },
			pov     : {
				heading: -60,
				pitch  : 10
			}
		});
		map.setStreetView(panorama);
	}

	render() {
		console.log('Map Rendered');
		return <div id="map" className="map" ref="map"></div>
	}
}

export default connect()(GoogleMap);

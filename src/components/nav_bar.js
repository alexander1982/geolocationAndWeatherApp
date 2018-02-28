import React, { Component } from 'react';

import { Field, reduxForm, reset, change } from 'redux-form';
import { connect } from 'react-redux';
import { fetchGeoLocation, toggleNavBarAction } from '../actions/index';

import $ from 'jquery';

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.toggleNav = this.toggleNav.bind(this);
	}

	componentWillReceiveProps(newProps) {
		console.log('hEY ', newProps.weather);
		console.log('hEY2 ', this.props.weather);
		if(newProps.location !== null && newProps.weather !== null && this.props.weather == null && !this.props.toggleNavBar || newProps.weather !== this.props.weather){
			$('#navbarDropdownMenuLink').click();
		}
	}

	onFormSubmit(values) {
		this.props.fetchGeoLocation(values);
	}

	toggleNav() {
		this.props.toggleNavBarAction();
	}

	renderField(field) {
		const { meta:{ touched, error } } = field;
		const className = `form-group ${touched && error? 'has-danger' : ''}`;

		return (
		<div className={className}>
			<label><em><h6>{field.label}</h6></em></label>
			<input
			className="form-control form-width transparent-input input-inner-text search-input text-muted"
			name="form-input"
			type="text"
			{...field.input}/>
			<div className="text-help">{touched? error : ''}</div>
		</div>
		)
	}

	render() {
		const { handleSubmit } = this.props;

		return (

		<nav className="navbar navbar-expand-lg navbar-dark indigo">
			<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
			        aria-controls="navbarSupportedContent"
			        aria-expanded="false" aria-label="Toggle navigation"
			        id="nav-toggler"
			        onClick={() => {this.toggleNav()}}
			><span className="navbar-toggler-icon"></span></button>

			<div className="collapse navbar-collapse" id="navbarSupportedContent">

				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						<a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">Features</a>
					</li>
					<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" data-toggle="dropdown"
						   aria-haspopup="true" aria-expanded="false">My Locations</a>
						<div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
							<a className="dropdown-item" href="#"><h6 className="color-white">Some Location</h6></a>
						</div>
					</li>

					<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" data-toggle="dropdown"
						   aria-expanded="false"><button
						className="dropdown-toggle btn btn-outline" type="button" id="newSearch"
						aria-expanded="false"
						onClick={() => {this.toggleNav()}}
						>New Search</button></a>
						<div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
							<a className="dropdown-item" href="#">
								<button
								id="navbarDropdownMenuLink"
								className="dropdown-toggle float-right" type="button" data-toggle="dropdown"
								aria-expanded="false"
								aria-haspopup="true"
								onClick={() => {this.toggleNav()}}
								><i className="fa fa-times"></i></button>
								<form className="street-margin" onSubmit={handleSubmit(this.onFormSubmit.bind(this))}>
									<Field
									label="Country"
									name="country"
									component={this.renderField}/>
									<Field
									label="City"
									name="city"
									component={this.renderField}/>
									<Field
									label="Street"
									name="street"
									component={this.renderField}/>
									<button type="submit" className="btn-lg btn-block btn-primary submit-style box-shadow-bright"><span
									className="submit-inner-html button-text-shadow">Search</span>
									</button>
								</form>
							</a>
						</div>
					</li>
				</ul>

			</div>
		</nav>
		)
	}
}

function validate(values) {
	const errors = {};

	if(!values.street){
		errors.street = 'Add a street name'
	}
	if(!values.city){
		errors.city = 'Add a city name'
	}
	if(!values.country){
		errors.country = 'Add a country name'
	}

	if(!values.street && !values.city && !values.country){

	}

	return errors;
}

const afterSubmit = (result, dispatch) => {
	dispatch(change('NewSearchForm_Nav_Bar', 'street', ''));
	dispatch(change('NewSearchForm_Nav_Bar', 'city', ''));
	dispatch(change('NewSearchForm_Nav_Bar', 'country', ''));
};

function mapStateToProps({ toggleNavBar, weather, location }) {
	return { toggleNavBar, weather, location };
}

export default reduxForm({
	                         validate,
	                         form           : 'NewSearchForm_Nav_Bar',
	                         onSubmitSuccess: afterSubmit
                         })(connect(mapStateToProps, { fetchGeoLocation, toggleNavBarAction })(NavBar))

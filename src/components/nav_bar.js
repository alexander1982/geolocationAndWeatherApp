import React, { Component } from 'react';

import { Field, reduxForm, reset, change } from 'redux-form';
import { connect } from 'react-redux';
import { fetchGeoLocation, cleanState } from '../actions/index';


class NavBar extends Component {

	onFormSubmit(values) {
		this.props.cleanState();
		this.props.fetchGeoLocation(values);

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
			        aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>

			<div className="collapse navbar-collapse" id="navbarSupportedContent">

				<ul className="navbar-nav mr-auto">
					<li className="nav-item active">
						<a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
					</li>
					<li className="nav-item">
						<a className="nav-link" href="#">Features</a>
					</li>
					<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown"
						   aria-haspopup="true" aria-expanded="false">My Locations</a>
						<div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
							<a className="dropdown-item" href="#"><h6 className="color-white">Some Location</h6></a>
						</div>
					</li>

					<li className="nav-item dropdown">
						<a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown"
						   aria-haspopup="true" aria-expanded="false">New Search</a>
						<div className="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
							<a className="dropdown-item" href="#">
								<button className="navbar-toggler float-right" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
								        aria-controls="navbarSupportedContent"
								        aria-expanded="false" aria-label="Toggle navigation"><i class="fa fa-times"></i></button>
								<form className="street-margin" onSubmit={handleSubmit(this.onFormSubmit.bind(this))}>
									<Field
									label="Street"
									name="street"
									component={this.renderField}/>
									<Field
									label="City"
									name="city"
									component={this.renderField}/>
									<Field
									label="Country"
									name="country"
									component={this.renderField}/>
									<button type="submit" className="btn-lg btn-block btn-primary submit-style box-shadow-bright"><span className="submit-inner-html button-text-shadow">Search</span>
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

	if(!values.street && !values.city && !values.country) {

	}

	return errors;
}

const afterSubmit = (result, dispatch) => {
	dispatch(change('NewSearchForm_Nav_Bar', 'street', ''));
	dispatch(change('NewSearchForm_Nav_Bar', 'city', ''));
	dispatch(change('NewSearchForm_Nav_Bar', 'country', ''));
};

export default reduxForm({
	                         validate,
	                         form           : 'NewSearchForm_Nav_Bar',
	                         onSubmitSuccess: afterSubmit
                         })(connect(null, { fetchGeoLocation, cleanState })(NavBar))

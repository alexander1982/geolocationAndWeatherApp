import React, { Component } from 'react';
import { Field, reduxForm, reset } from 'redux-form';
import { connect } from 'react-redux';
import { fetchGeoLocation } from '../actions/index';

class SearchNew extends Component {
	constructor(props) {
		super(props);
	}

	onFormSubmit(values) {
		this.props.fetchGeoLocation(values);
	}


	renderField(field) {
		const { meta:{ touched, error } } = field;
		const className = `form-group ${touched && error? 'has-danger' : ''}`;

		return (
		<div className={className}>
			<label>{field.label}</label>
			<input
			className="form-control form-width transparent-input input-inner-text search-input"
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
		<div>
			<h4>Locate the weather</h4>
			<hr/>
			<form onSubmit={handleSubmit(this.onFormSubmit.bind(this))}>
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
				<button type="submit" className="btn-lg btn-block btn-primary submit-style"><span className="submit-inner-html">Search</span>
				</button>
			</form>
		</div>
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

	return errors;
}

const afterSubmit = (result, dispatch) => dispatch(reset('New search form'));

export default reduxForm({
	                         validate,
	                         form           : 'New search form',
	                         onSubmitSuccess: afterSubmit
                         })(connect(null, { fetchGeoLocation })(SearchNew))
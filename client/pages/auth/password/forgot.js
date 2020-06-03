import Router from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { API } from '../../../config';
import Layout from '../../../components/Layout';

const ForgotPassword = () => {
	const [ state, setState ] = useState({
		email: '',
		buttonText: 'Forgot Password',
		success: '',
		error: ''
	});

	const { email, buttonText, success, error } = state;

	const handleChange = (e) => {
		setState({ ...state, email: e.target.value, success: '', error: '' });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.log('POST email', email)
		try {
			const response = await axios.put(`${API}/forgot-password`, { email });
			// console.log('Forgot Password Response', response)
			setState({ ...state, email: '', buttonText: 'Done', success: response.data.message });
		} catch (err) {
			//
			setState({ ...state, buttonText: 'Forgot Password', error: err.response.data.error });
		}
	};

	const passwordForgotForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						type="email"
						className="form-control"
						onChange={handleChange}
						value={email}
						placeholder="Type your email"
						required
					/>
				</div>
				<div>
					<button className="btn btn-outline-warning float-right">{buttonText}</button>
				</div>
			</form>
		);
	};

	return (
		<Layout>
            <div className='row'>
                <div className='col-md-6 offset-md-3'>
                    <h1>Forgot Password</h1>
                    <br />
                    {success && showSuccessMessage(success)}
                    {error && showErrorMessage(error)}
                </div>
            </div>
            
			{passwordForgotForm()}
		</Layout>
	);
};

export default ForgotPassword;

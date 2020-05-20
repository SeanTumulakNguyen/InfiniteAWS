import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { authenticate, isAuth } from '../helpers/auth';

const Login = () => {
	const [ values, setValues ] = useState({
		email: '',
		password: '',
		buttonText: 'Login',
		error: '',
		success: ''
	});

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	const { email, password, error, success, buttonText } = values;

	const handleChange = (name) => (e) => {
		setValues({ ...values, [name]: e.target.value, error: '', success: '', buttonText: 'Login' });
		// console.log(e.target.value)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setValues({ ...values, buttonText: 'Logging in' });
		try {
			const response = await axios.post(`${API}/login`, {
				email,
				password
			});
			// console.log(response)
			authenticate(response, () => {
				return isAuth() && isAuth().role === 'admin' ? Router.push('/admin') : Router.push('/user');
			});
		} catch (error) {
			setValues({
				...values,
				buttonText: 'Login',
				error: error.response.data.error
			});
		}
	};

	const loginForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						onChange={handleChange('email')}
						type="email"
						className="form-control"
						value={email}
						placeholder="Type your email"
						required
					/>
				</div>
				<div className="form-group">
					<input
						onChange={handleChange('password')}
						type="password"
						className="form-control"
						value={password}
						placeholder="Type your password"
						required
					/>
				</div>
				<div className="form-group">
					<button className="btn btn-outline-warning float-right">{buttonText}</button>
				</div>
			</form>
		);
	};

	return (
		<Layout>
			<div className="col-md-6 offset-md-3">
				<h1>Login</h1>

				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{loginForm()}
			</div>
		</Layout>
	);
};

export default Login;

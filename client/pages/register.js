import Layout from '../components/Layout';
import { useState } from 'react';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';

const Register = () => {
	const [
		values,
		setValues
	] = useState({
		name: '',
		email: '',
		password: '',
		buttonText: 'Register',
		error: '',
		success: ''
	});

	const { name, email, password, error, success, buttonText } = values;

	const handleChange = (name) => (e) => {
		setValues({ ...values, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
		// console.log(e.target.value)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setValues({ ...values, buttonText: 'Registering' });
		try {
			const response = await axios.post(`http://localhost:8000/api/register`, {
				name,
				email,
				password
			});
			setValues({
				...values,
				name: '',
				email: '',
				password: '',
				buttonText: 'Submitted',
				success: response.data.message
			});
		} catch (error) {
			setValues({
				...values,
				buttonText: 'Register',
				error: error.response.data.error
			});
		}
	};

	// const handleSubmit = (e) => {
	// 	e.preventDefault();
	// 	setValues({ ...values, buttonText: 'Registering' });
	// 	// console.table({ name, email, password });
	// 	axios
	// 		.post(`http://localhost:8000/api/register`, {
	// 			name,
	// 			email,
	// 			password
	// 		})
	// 		.then((response) => {
	// 			setValues({
	// 				...values,
	// 				name: '',
	// 				email: '',
	// 				password: '',
	// 				buttonText: 'Submitted',
	// 				success: response.data.message
	// 			});
	// 		})
	// 		.catch((error) => {
	// 			setValues({
	// 				...values,
	// 				buttonText: 'Register',
	// 				error: error.response.data.error
	// 			});
	// 		});
	// };

	const registerForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<input
						onChange={handleChange('name')}
						type="text"
						className="form-control"
						value={name}
						placeholder="Type your name"
					/>
				</div>
				<div className="form-group">
					<input
						onChange={handleChange('email')}
						type="email"
						className="form-control"
						value={email}
						placeholder="Type your email"
					/>
				</div>
				<div className="form-group">
					<input
						onChange={handleChange('password')}
						type="password"
						className="form-control"
						value={password}
						placeholder="Type your password"
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
				<h1>Register</h1>
				<br />
				{success && showSuccessMessage(success)}
				{error && showErrorMessage(error)}
				{registerForm()}
			</div>
		</Layout>
	);
};

export default Register;

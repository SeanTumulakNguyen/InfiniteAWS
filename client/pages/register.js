import Layout from '../components/Layout';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import axios from 'axios';
import { showSuccessMessage, showErrorMessage } from '../helpers/alerts';
import { API } from '../config';
import { isAuth } from '../helpers/auth';

const Register = () => {
	const [ values, setValues ] = useState({
		name: '',
		email: '',
		password: '',
		buttonText: 'Register',
		error: '',
		success: '',
		loadedCategories: [],
		categories: []
	});

	const { name, email, password, error, success, buttonText, loadedCategories, categories } = values;

	useEffect(() => {
		isAuth() && Router.push('/');
	}, []);

	useEffect(() => {
		loadCategories();
	}, []);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setValues({ ...values, loadedCategories: response.data });
	};

	const handleToggle = (c) => () => {
		// return the first index or -1
		const clickedCategory = categories.indexOf(c);
		const all = [ ...categories ];

		if (clickedCategory === -1) {
			all.push(c);
		} else {
			all.splice(clickedCategory, 1);
		}

		// console.log('All >> categories', all)
		setValues({ ...values, categories: all, success: '', error: '' });
	};

	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map((c, i) => {
				return (
					<li className="list-unstyled" key={i}>
						<input type="checkbox" onChange={handleToggle(c._id)} className="mr-2" />
						<label className="form-check-label">{c.name}</label>
					</li>
				);
			})
		);
	};

	const handleChange = (name) => (e) => {
		setValues({ ...values, [name]: e.target.value, error: '', success: '', buttonText: 'Register' });
		// console.log(e.target.value)
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setValues({ ...values, buttonText: 'Registering' });
		try {
			const response = await axios.post(`${API}/register`, {
				name,
				email,
				password,
				categories
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
						required
					/>
				</div>
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
					<label className="text-muted ml-4">Category</label>
					<ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showCategories()}</ul>
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

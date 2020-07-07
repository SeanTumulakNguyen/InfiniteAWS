import { useState, useEffect } from 'react';
import Layout from '../../../components/Layout';
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import { getCookie, isAuth } from '../../../helpers/auth';
import  withUser  from '../../withUser'

const Update = ({ oldLink, token }) => {
	const [ state, setState ] = useState({
		title: oldLink.title,
		url: oldLink.url,
		categories: oldLink.categories,
		loadedCategories: [],
		success: '',
		error: '',
		type: oldLink.type,
		medium: oldLink.medium
	});

	const { title, url, categories, loadedCategories, success, error, type, medium } = state;

	useEffect(
		() => {
			loadCategories();
		},
		[ success ]
	);

	const loadCategories = async () => {
		const response = await axios.get(`${API}/categories`);
		setState({ ...state, loadedCategories: response.data });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// console.table({title, url, categories, type, medium})
		try {
			const response = await axios.put(
				`${API}/link/${oldLink._id}`,
				{ title, url, categories, type, medium },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			setState({...setState, success: 'Link is updated'})
		} catch (error) {
			// console.log('Link submit error', error)
			setState({ ...state, error: error.response.data.error });
		}
	};

	const handleTitleChange = (e) => {
		setState({ ...state, title: e.target.value, error: '', success: '' });
	};

	const handleURLChange = (e) => {
		setState({ ...state, url: e.target.value, error: '', success: '' });
	};

	const handleTypeClick = (e) => {
		setState({ ...state, type: e.target.value, success: '', error: '' });
	};

	const showTypes = () => (
		<React.Fragment>
			<div className="form-check ml-3">
				<label className="form-check-label">
					<input
						type="radio"
						onClick={handleTypeClick}
						checked={type === 'free'}
						value="free"
						name="type"
						readOnly
					/>{' '}
					Free
				</label>
			</div>

			<div className="form-check ml-3">
				<label className="form-check-label">
					<input
						type="radio"
						onClick={handleTypeClick}
						checked={type === 'paid'}
						value="paid"
						name="type"
						readOnly
					/>{' '}
					Paid
				</label>
			</div>
		</React.Fragment>
	);

	const showMedium = () => (
		<React.Fragment>
			<div className="form-check ml-3">
				<label className="form-check-label">
					<input
						type="radio"
						onClick={handleMediumClick}
						checked={medium === 'video'}
						value="video"
						name="medium"
						readOnly
					/>{' '}
					Video
				</label>
			</div>

			<div className="form-check ml-3">
				<label className="form-check-label">
					<input
						type="radio"
						onClick={handleMediumClick}
						checked={medium === 'book'}
						value="book"
						name="medium"
						readOnly
					/>{' '}
					Book
				</label>
			</div>
		</React.Fragment>
	);

	const handleMediumClick = (e) => {
		setState({ ...state, medium: e.target.value, success: '', error: '' });
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
		setState({ ...state, categories: all, success: '', error: '' });
	};

	const showCategories = () => {
		return (
			loadedCategories &&
			loadedCategories.map((c, i) => {
				return (
					<li className="list-unstyled" key={i}>
						<input type="checkbox" checked={categories.includes(c._id)} onChange={handleToggle(c._id)} className="mr-2" />
						<label className="form-check-label">{c.name}</label>
					</li>
				);
			})
		);
	};

	const submitLinkForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-muted">Title</label>
					<input type="text" className="form-control" onChange={handleTitleChange} value={title} />
				</div>
				<div className="form-group">
					<label className="text-muted">URL</label>
					<input type="url" className="form-control" onChange={handleURLChange} value={url} />
				</div>
				<div>
					<button disabled={!token} className="btn btn-outline-warning float-right" type="submit">
						{isAuth() || token ? 'Update' : 'Login to Update'}
					</button>
				</div>
			</form>
		);
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-12">
					<h1>Update Link/URL</h1>
					<br />
				</div>
			</div>
			<div className="row">
				<div className="col-md-4">
					<div className="form-group">
						<label className="text-muted ml-4">Category</label>
						<ul style={{ maxHeight: '100px', overflowY: 'scroll' }}>{showCategories()}</ul>
					</div>
					<div className="form-group">
						<label className="text-muted ml-4">Type</label>
						{showTypes()}
					</div>
					<div className="form-group">
						<label className="text-muted ml-4">Medium</label>
						{showMedium()}
					</div>
				</div>
				<div className="col-md-8">
					{success && showSuccessMessage(success)}
					{error && showErrorMessage(error)}
					{submitLinkForm()}
				</div>
			</div>
		</Layout>
	);
};

Update.getInitialProps = async ({ req, token, query }) => {
	const response = await axios.get(`${API}/link/${query.id}`);
	return { oldLink: response.data, token };
};

export default withUser(Update);

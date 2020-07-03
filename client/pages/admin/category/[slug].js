import dynamic from 'next/dynamic';
import Layout from '../../../components/Layout';
import withAdmin from '../../withAdmin';
import { useState, useEffect } from 'react';
import Resizer from 'react-image-file-resizer';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import axios from 'axios';
import { API } from '../../../config';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import 'react-quill/dist/quill.bubble.css';

const Update = ({ oldCategory, token }) => {
	const [ state, setState ] = useState({
		name: oldCategory.name,
		error: '',
		success: '',
		image: '',
		imagePreview: oldCategory.image.url,
		buttonText: 'Update'
	});

	const [ content, setContent ] = useState(oldCategory.content);

	const [ imageUploadButtonName, setImageUploadeButtonName ] = useState('Update image');

	const { name, error, success, image, buttonText, imagePreview } = state;

    const handleChange = (name) => (e) => {
		setState({ ...state, buttonText: 'Update', [name]: e.target.value, error: '', success: '' });
		// console.log(e.target.value)
	};

	const handleContent = (e) => {
		// console.log(e)
		setContent(e);
		setState({ ...state, buttonText: 'Update', success: '', error: '' });
	};

    const handleImage = (event) => {
        setState({...state, buttonText: 'Update'})
		let fileInput = false;
		if (event.target.files[0]) {
			fileInput = true;
		}
		if (fileInput) {
			setImageUploadeButtonName(event.target.files[0].name);
			Resizer.imageFileResizer(
				event.target.files[0],
				300,
				300,
				'JPEG',
				100,
				0,
				(uri) => {
					// console.log(uri);
					setState({ ...state, image: uri, success: '', error: '' });
				},
				'base64'
			);
		} else {
			setImageUploadeButtonName('Upload image');
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setState({ ...state, buttonText: 'Updating' });
		// console.table({name, content, image});
		try {
			const response = await axios.put(
				`${API}/category/${oldCategory.slug}`,
				{ name, content, image },
				{
					headers: {
						Authorization: `Bearer ${token}`
					}
				}
			);
			// console.log('Category Update Response', response);
            setImageUploadeButtonName('Update image');
            setContent(response.data.content)
			setState({
				...state,
				buttonText: 'Updated',
				success: `${response.data.name} has been updated`
            });
		} catch (error) {
			console.log('Category Create Error', error);
			setState({ ...state, buttonText: 'Create', error: error.response.data.error });
		}
	};

	const updateCategoryForm = () => {
		return (
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label className="text-muted">Name</label>
					<input className="form-control" onChange={handleChange('name')} value={name} required type="text" />
				</div>
				<div className="form-group">
					<label className="text-muted">Content</label>
					<ReactQuill
						value={content}
						onChange={handleContent}
						placeholder="Write something"
						theme="bubble"
						className="pb-5 mb-3"
						style={{ border: '1px solid #666' }}
					/>
				</div>
				<div className="form-group pb-5">
					<label className="btn btn-outline-secondary float-right">
						{imageUploadButtonName} {' '}
						{image ? (
							<span>
								<img src={image} alt="image" height="40px" />
							</span>
						) : (
							<span>
								<img src={imagePreview} alt="image" height="40px" />
							</span>
						)}
						<input className="form-control" onChange={handleImage} type="file" accept="image/*" hidden />
					</label>
				</div>
				<div>
					<button className="btn btn-outline-warning float-right">{buttonText}</button>
				</div>
			</form>
		);
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h1>Update category</h1>
					<br />
					{error && showErrorMessage(error)}
					{success && showSuccessMessage(success)}
					{updateCategoryForm()}
				</div>
			</div>
		</Layout>
	);
};

Update.getInitialProps = async ({ req, query, token }) => {
	const response = await axios.post(`${API}/category/${query.slug}`);
	return { oldCategory: response.data.category, token };
};

export default withAdmin(Update);

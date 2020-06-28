import Layout from '../../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { API } from '../../config';
import renderHTML from 'react-render-html';
import { useState } from 'react';
import moment from 'moment';

const Links = ({ query, category, links, totalLinks, linksLimit, linkSkip }) => {
	const [ allLinks, setAllLinks ] = useState(links);
	const [ limit, setLimit ] = useState(linksLimit);
	const [ skip, setSkip ] = useState(0);
	const [ size, setSize ] = useState(totalLinks);

	const listOfLinks = () => {
		return allLinks.map((l, i) => {
			return (
				<div className="row alert alert-primary p-2">
					<div className="col-md-8">
						<a href={l.url} target="_blank">
							<h5 className="pt-2">{l.title}</h5>
							<h6 className="pt-2 text-danger" style={{ fontSize: '12px' }}>
								{l.url}
							</h6>
						</a>
					</div>
					<div className="col-md-4 pt-2">
						<span className="pull-right">
							{moment(l.createdAt).fromNow()} by {l.postedBy.name}
						</span>
					</div>
					<div className="col-md-12">
						<span className="badge text-dark">
							{l.type} / {l.medium}
						</span>
						{l.categories.map((c, i) => {
							return <span className="badge text-success">{c.name}</span>;
						})}
					</div>
				</div>
			);
		});
	};

	const loadMoreButton = (e) => {
		return (
			size > 0 &&
			size >= limit && (
				<button onClick={loadMore} className="btn btn-outline-primary btn-lg">
					Load more
				</button>
			)
		);
	};

	const loadMore = async () => {
		let toSkip = skip + limit;

        const response = await axios.post(`${API}/category/${query.slug}`, { toSkip, limit });
        
        setAllLinks([...allLinks, ...response.data.links])
        setSize(response.data.links.length)
        setSkip(toSkip)
	};

	return (
		<Layout>
			<div className="row">
				<div className="col-md-8">
					<h1 className="display-4 font-weight-bold">{category.name} - URL/Links</h1>
					<div className="lead alert alert-secondary pt-4">{renderHTML(category.content || '')}</div>
				</div>
				<div className="col-md-4">
					<img src={category.image.url} alt={category.name} style={{ width: 'auto', maxHeight: '200px' }} />
				</div>
			</div>
			<br />
			<div className="row">
				<div className="col-md-8">{listOfLinks()}</div>
				<div className="col-md-4">
					<h2 className="lead">Most popular in {category.name}</h2>
					<p>show popular links</p>
				</div>
			</div>
			<div className="text center pb-5 pt-4">{loadMoreButton()}</div>
		</Layout>
	);
};

Links.getInitialProps = async ({ query, req }) => {
	let skip = 0;
	let limit = 1;

	const response = await axios.post(`${API}/category/${query.slug}`, { skip, limit });

	return {
		query,
		category: response.data.category,
		links: response.data.links,
		totalLinks: response.data.links.length,
		linksLimit: limit,
		linkSkip: skip
	};
};

export default Links;

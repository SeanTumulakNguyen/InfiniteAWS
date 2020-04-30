import Head from 'next/head';

const Layout = ({ children }) => {
	const head = () => {
		return (
			<link
				rel="stylesheet"
				href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
				integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
				crossOrigin="anonymous"
			/>
		);
	};

	const nav = () => {
		return (
			<ul className="nav nav-tabs bg-warning ">
				<li className="nav-item">
					<a className="nav-link text-dark" href="">
						Home
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link text-dark" href="">
						Login
					</a>
				</li>
				<li className="nav-item">
					<a className="nav-link text-dark" href="">
						Register
					</a>
				</li>
			</ul>
		);
	};

	return (
		<React.Fragment>
			{head()} {nav()}
			<div className="container pt-5 pb-5">{children}</div>
		</React.Fragment>
	);
};

export default Layout;

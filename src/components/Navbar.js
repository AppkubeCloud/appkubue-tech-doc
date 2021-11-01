import React from 'react';
import PropTypes from 'prop-types'
import { Link, graphql, StaticQuery } from 'gatsby';
import { kebabCase } from 'lodash'
import logo from '../img/logo.png';
import { BsArrowRight, BsChevronUp } from 'react-icons/bs';

class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			mainMenuActiveIndex: -1,
			activeMenu: 0,
			mobileMenuActiveStatus: [false, false],
			mobileSubMenuActiveStatus: [[],[]],
			currentPath: ''
		};
	}

	setCurrentPage = () => {
		if (typeof (window) !== 'undefined') {
			const location = window.location;
			this.setState({
				currentPath: location.pathname
			});
		}
	};

	componentDidMount() {
		this.setCurrentPage();
	}

	toggleHamburger = () => {
		var body = document.getElementsByTagName("body")[0];
		if (!this.state.active) {
			body.classList.add("no-scroll");
		} else {
			body.classList.remove("no-scroll");
		}
		this.setState({
			active: !this.state.active
		});
	};

	setMobileSubMenuActiveStats = (menuIndex, index) => {
		const { mobileSubMenuActiveStatus } = this.state;
		mobileSubMenuActiveStatus[menuIndex][index] = !mobileSubMenuActiveStatus[menuIndex][index];
		this.setState({
			mobileSubMenuActiveStatus
		});
	};

	setMobileMenuActiveStatus = (index) => {
		const { mobileMenuActiveStatus } = this.state;
		mobileMenuActiveStatus[index] = !mobileMenuActiveStatus[index];
		this.setState({
			mobileMenuActiveStatus
		});
	};

	onMouseOver = (index) => {
		this.setState({
			activeMenu: index
		});
	};

	setMainMenuActive = (index) => {
		this.setState({
			mainMenuActiveIndex: index
		});
	};

	renderCategoriesDesktop = (mainCategory, posts) => {
		const retData = [];
		const dataStr = {};
		const { currentPath } = this.state;
		if (posts && posts.length > 0) {
			const length = posts.length;
			for (let i = 0; i < length; i++) {
				const post = posts[i].node;
				const categories = post.frontmatter.category;
				if (categories && categories.length > 0 && categories[0] === mainCategory) {
					let subCategory = categories[1];
					dataStr[subCategory] = dataStr[subCategory] || [];
					dataStr[subCategory].push({
						slug: post.fields.slug,
						title: post.frontmatter.title
					});
				}
			}
			const keys = Object.keys(dataStr);
			for (let i = 0; i < keys.length; i++) {
				const subCategory = keys[i];
				const pages = dataStr[keys[i]];
				const sideJSX = <>
					<Link to={`/category/${kebabCase(subCategory)}`} className={`navbar-link ${currentPath === `/category/${kebabCase(subCategory)}` ? 'current-page' : ''}`}>
						{subCategory}
						<BsArrowRight className='sub-icon' />
					</Link>
				</>;
				const rightSideJSX = [];
				for (let j = 0; j < pages.length; j++) {
					const page = pages[j];
					rightSideJSX.push(
						<li key={page.slug}>
							<Link to={page.slug} className="navbar-link">
								{page.title}
							</Link>
						</li>
					);
				}
				retData.push(
					<li key={subCategory} onMouseOver={() => this.onMouseOver(i)}
						className={`${this.state.activeMenu === i ? 'active' : ''}`}>
						{sideJSX}
						<ul className="sub-menu">
							{rightSideJSX}
						</ul>
					</li>
				);
			}
		}
		return retData;
	};

	renderCategoriesMobile = (mainCategory, posts, menuIndex) => {
		const retData = [];
		const dataStr = {};
		const { mobileSubMenuActiveStatus, currentPath } = this.state;
		if (posts && posts.length > 0) {
			const length = posts.length;
			for (let i = 0; i < length; i++) {
				const post = posts[i].node;
				const categories = post.frontmatter.category;
				if (categories && categories.length > 0 && categories[0] === mainCategory) {
					let subCategory = categories[1];
					dataStr[subCategory] = dataStr[subCategory] || [];
					dataStr[subCategory].push({
						slug: post.fields.slug,
						title: post.frontmatter.title
					});
				}
			}
			const keys = Object.keys(dataStr);
			for (let i = 0; i < keys.length; i++) {
				const subCategory = keys[i];
				const pages = dataStr[keys[i]];
				const sideJSX = <>
					<Link to={`/category/${kebabCase(subCategory)}`} className={`navbar-link ${currentPath === `/category/${kebabCase(subCategory)}` ? 'current-page' : ''}`}>
						{subCategory}
						{/* <BsArrowRight className='sub-icon' /> */}
					</Link>
					<span
						onClick={() => this.setMobileSubMenuActiveStats(menuIndex, i)}
						className={`toggle ${mobileSubMenuActiveStatus[menuIndex][i] ? 'active' : ''}`}
					></span>
				</>;
				const rightSideJSX = [];
				for (let j = 0; j < pages.length; j++) {
					const page = pages[j];
					rightSideJSX.push(
						<li key={page.slug}>
							<Link to={page.slug} className="navbar-link">
								{page.title}
							</Link>
						</li>
					);
				}
				retData.push(
					<li key={subCategory} className={`sub-navbar-item ${mobileSubMenuActiveStatus[menuIndex][i] ? 'active' : ''}`}>
						{sideJSX}
						<ul className={`sub-menu ${mobileSubMenuActiveStatus[menuIndex][i] ? 'active' : ''}`}>
							{rightSideJSX}
						</ul>
					</li>
				);
			}
		}
		return retData;
	};

	render() {
		const { data } = this.props;
		const { edges: posts } = data.allMarkdownRemark;
		const { mainMenuActiveIndex, active, mobileSubMenuIndex, mobileMenuActiveStatus } = this.state;
		return (
			<header className="d-flex flex-nowrap justify-content-between align-items-center w-100 py-4 py-lg-0 header">
				<Link to='/' className='flex-grow-1'>
					<img src={logo} alt="Synectiks logo" />
				</Link>
				<div className="d-none d-lg-block">
					<ul className="nav nav-pills">
						{/* <li className={`nav-item dropdown ${mainMenuActiveIndex === 0 ? 'active' : ''}`} onMouseOver={() => this.setMainMenuActive(0)} onMouseOut={() => this.setMainMenuActive(-1)}>
							<a href="#">Product &amp; Solutions <i className="fas fa-chevron-down"></i></a>
							<div className={`main-sub-menu`}>
								<ul className="default-active">
									{this.renderCategoriesDesktop("product", posts)}
								</ul>
								<button className="btn btn-close" onClick={() => this.setMainMenuActive(-1)}>
									<BsChevronUp className='sub-icon' />
								</button>
							</div>
						</li>
						<li className={`nav-item dropdown ${mainMenuActiveIndex === 1 ? 'active' : ''}`} onMouseOver={() => this.setMainMenuActive(1)} onMouseOut={() => this.setMainMenuActive(-1)}>
							<a href="#">Services &amp; Consulting <i className="fas fa-chevron-down"></i></a>
							<div className={`main-sub-menu`}>
								<ul className="default-active">
									{this.renderCategoriesDesktop("service", posts)}
								</ul>
								<button className="btn btn-close" onClick={() => this.setMainMenuActive(-1)}>
									<BsChevronUp className='sub-icon' />
								</button>
							</div>
						</li>
						<li className="nav-item">
							<Link to="/workflowpost">Workflow</Link>
						</li>
						<li className="nav-item">
							<Link to="/survey">Survey Form</Link>
						</li> */}
						<li className="nav-item">
							<Link to="/scenario/1">Scenario</Link>
						</li>
						<li className="nav-item">
							<Link to="/xformation/xformation/">Xformation</Link>
						</li>
					</ul>
				</div>
				<div className="nav-search">
					<a href="#" data-bs-toggle="modal" data-bs-target="#searchModal"><i className="fas fa-search"></i></a>
				</div>
				<nav className="d-block d-lg-none mobile-menu">
					<button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
						<span className="fa fa-bars"></span>
					</button>
					<div className="collapse navbar-collapse" id="navbarNav">
						<button className="navbar-toggler navbar-close" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
							<span className="fa fa-times"></span>
						</button>
						<ul className="navbar-nav">
							{/* <li className={`navbar-item dropdown`}>
								<Link className="navbar-link">Product & Solutions</Link>
								<span
									onClick={() => this.setMobileMenuActiveStatus(0)}
									className={`toggle ${mobileMenuActiveStatus[0] ? 'active' : ''}`}
								>
								</span>
								<div className={`main-sub-menu ${mobileMenuActiveStatus[0] ? 'active' : ''}`}>
									<ul className="default-active">
										{this.renderCategoriesMobile("product", posts, 0)}
									</ul>
								</div>
							</li>
							<li className={`navbar-item dropdown`}>
								<Link className="navbar-link">Services & Consulting</Link>
								<span
									onClick={() => this.setMobileMenuActiveStatus(1)}
									className={`toggle ${mobileMenuActiveStatus[1] ? 'active' : ''}`}
								>
								</span>
								<div className={`main-sub-menu ${mobileMenuActiveStatus[1] ? 'active' : ''}`}>
									<ul className="default-active">
										{this.renderCategoriesMobile("service", posts, 1)}
									</ul>
								</div>
							</li> */}
							{/* <li className="navbar-item">
								<Link to="/workflowpost" className="navbar-link">Workflow</Link>
							</li>
							<li className="navbar-item">
								<Link to="/survey" className="navbar-link">Survey Form</Link>
							</li> */}
							<li className="navbar-item">
								<Link to="/scenario/1" className="navbar-link">Scenario</Link>
							</li>
							<li className="nav-item">
							<Link to="/xformation/xformation/">Xformation</Link>
						</li>
						</ul>
					</div>
				</nav>

				<div className="modal fade" id="searchModal" tabIndex="-1" aria-labelledby="searchModalLabel" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered search-modal">
						<div className="modal-content">
							<div className="modal-header">
								<input type="text" placeholder="Search..." className="form-control" />
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
						</div>
					</div>
				</div>
			</header>
		);
	}
}

Navbar.propTypes = {
	data: PropTypes.shape({
		allMarkdownRemark: PropTypes.shape({
			edges: PropTypes.array,
		}),
	}),
}

export default () => (
	<StaticQuery
		query={graphql`
			query NavbarQuery {
				allMarkdownRemark(
					sort: { order: DESC, fields: [frontmatter___date] }
					filter: { frontmatter: { templateKey: { eq: "service-post" } } }
				) {
					edges {
						node {
							excerpt(pruneLength: 400)
							id
							fields {
								slug
							}
							frontmatter {
								title
								page {
									heading
								},
								category
							}
						}
					}
				}
			}
		`}
		render={(data, count) => <Navbar data={data} count={count} />}
	/>
)

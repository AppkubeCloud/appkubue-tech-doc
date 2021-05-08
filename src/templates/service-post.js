import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import '../css/service.css';
import ScrollTop from '../components/ScrollTop';
import ScrollBottom from '../components/ScrollBottom';
import WhyUs from '../components/Service/WhyUs';
import OurAproach from '../components/Service/OurAproach';
import GettingStarted from '../components/Service/GettingStarted';
import Resources from '../components/Service/Resources';
import remark from 'remark';
import remarkHTML from 'remark-html';
import { HTMLContent } from '../components/Content';
const toHTML = (value) =>
  remark().use(remarkHTML).processSync(value).toString();


export const ServicePostTemplate = ({ bannerdescription, bannericon, bannericonname, bannerimage, helmet, whyus, aproach, gettingstarted, resources }) => {
  // const pages = ["Why Us", "Our Approach", "Getting Started", "Resources"];
  const pages = [{
    name: "Why Us",
    component: <WhyUs data={whyus} />,
    show: whyus.showblock
  }, {
    name: "Our Approach",
    component: <OurAproach data={aproach} />,
    show: aproach.showblock
  }, {
    name: "Getting Started",
    component: <GettingStarted data={gettingstarted} />,
    show: gettingstarted.showblock
  }, {
    name: "Resources",
    component: <Resources data={resources} />,
    show: resources.showblock
  }];
  let totalShownSlides = 0;
  const [currentSlide, setCurrentSlide] = useState(0);
  function updateCurrentSlide(factor) {
    if (currentSlide + factor >= 0 && currentSlide + factor <= (totalShownSlides - 1)) {
      setCurrentSlide(currentSlide + factor);
    }
  }
  function renderTab(pages) {
    const retData = [];
    let index = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].show) {
        let l = index;
        retData.push(
          <li className="nav-item">
            <button onClick={() => { setCurrentSlide(l) }} className={`${currentSlide === index ? 'active' : ''} nav-link`} >{pages[i].name}<i className="fa fa-arrow-down"></i></button>
          </li>
        );
        index += 1;
      }
    }
    totalShownSlides = index;
    return retData;
  }
  function renderTabContent(pages) {
    const retData = [];
    let index = 0;
    for (let i = 0; i < pages.length; i++) {
      if (pages[i].show) {
        let l = index;
        retData.push(
          <div className={`tab-pane fade ${currentSlide === l ? 'active show' : ''}`}>
            {pages[i].component}
          </div>
        );
        index += 1;
      }
    }
    return retData;
  }
  return (
    <React.Fragment>
      {helmet || ''}
      <div className="service-contaienr">
        <div className="d-flex w-100 flex-wrap align-items-center justify-content-between pb-5 banner-container">
          <div className="d-inline-block banner-left">
            <div className="d-block banner-img"><img src={bannerimage} alt="" /></div>
            <div className="d-inline-block text-center mx-lg-5 mx-2 mb-lg-0 mb-3 p-4 banner-text">
              <HTMLContent content={toHTML(bannerdescription)} />
            </div>
          </div>
          <div className="d-inline-block text-center banner-right">
            <div className="d-block banner-icon-img"><img src={bannericon} alt="" /></div>
            <div className="d-block banner-heading">{bannericonname}</div>
          </div>
        </div>
        <div className="d-block tab-container">
          <div className="d-block py-4 px-lg-5 px-3 tabs">
            <ul className="nav nav-tabs w-100 justify-content-between">
              {renderTab(pages)}
            </ul>
          </div>
          <div className="tab-content position-relative">
            {
              currentSlide !== 0 &&
              <button onClick={() => updateCurrentSlide(-1)} className="btn tabs-arrow-left">
                <i className="fa fa-long-arrow-alt-left"></i>
              </button>
            }
            {
              currentSlide !== totalShownSlides - 1 &&
              <button onClick={() => updateCurrentSlide(1)} className="btn tabs-arrow-right">
                <i className="fa fa-long-arrow-alt-right"></i>
              </button>
            }
            {renderTabContent(pages)}
          </div>
        </div>
      </div>
      <ScrollTop showAbove={50} />
      <ScrollBottom showBelow={50} />
    </React.Fragment>
  );
};

ServicePostTemplate.propTypes = {
  bannerdescription: PropTypes.string,
  bannerimage: PropTypes.string,
  bannericon: PropTypes.string,
  bannericonname: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
  whyus: PropTypes.object,
  aproach: PropTypes.object,
  gettingstarted: PropTypes.object,
  resources: PropTypes.object
};

const ServicePost = ({ data }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout>
      <ServicePostTemplate
        bannerdescription={post.frontmatter.bannerdescription}
        bannerimage={post.frontmatter.bannerimage}
        bannericon={post.frontmatter.bannericon}
        bannericonname={post.frontmatter.bannericonname}
        helmet={
          <Helmet titleTemplate='%s | Service'>
            <title>{`${post.frontmatter.title}`}</title>
            <meta
              name='description'
              content={`${post.frontmatter.bannerdescription}`}
            />
          </Helmet>
        }
        title={post.frontmatter.title}
        whyus={post.frontmatter.whyus}
        aproach={post.frontmatter.aproach}
        gettingstarted={post.frontmatter.gettingstarted}
        resources={post.frontmatter.resources}
      />
    </Layout>
  );
};

ServicePost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default ServicePost;

export const pageQuery = graphql`
  query ServicePostByID($id: String!) {
          markdownRemark(id: {eq: $id }) {
          id
      html
      frontmatter {
          date(formatString: "MMMM DD, YYYY")
        title
        bannerimage
        bannerdescription
        bannericon
        bannericonname
        whyus {
          showblock
          img
          description
          productdescription
          reasonstext
          reasons {
            img
            text
            description
          }
          conclusion
          conclusionimg
        }
        aproach {
          showblock
          img
          description
          actions {
            img
            heading
            text
          }
        }
        gettingstarted {
          showblock
          actions {
            img
            description
          }
          testimonial
        }
        resources {
          showblock
          blogs{
            img
            heading
            description
            link
          }
          whitepapers{
            img
            heading
            description
            link
          }
          casestudies{
            img
            heading
            description
            link
          }
        }
      }
    }
  }
`;

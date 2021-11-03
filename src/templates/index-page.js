import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import { v4 } from "uuid";
import Layout from "../components/Layout";
import "../css/home.css";
import remark from "remark";
import remarkHTML from "remark-html";
import Carousel from "nuka-carousel";
import Migration from "../pages/migration";
import { AiFillBook, AiOutlineBook } from "react-icons/ai";
// import Migration from '../components/Migration'

const TextContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: white;
  position: relative;
  span::before {
    content: "";
    display: block;
    width: 100%;
    height: 2px;
    position: absolute;
    top: 0px;
    background-color: white;
  }
`;
const toHTML = (value) =>
  remark().use(remarkHTML).processSync(value).toString();

export class IndexPageTemplate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numberOfSlides: 2,
      currentSlide: 0,
      totalSlides: 0,
      partnersToShow: 4,
      autoPlayPartners: false,
      totalPartners: 0,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateNumberOfSlides);
    setTimeout(() => {
      this.updateNumberOfSlides();
    }, 500);
    if (this.props.successstories) {
      this.setState({
        totalSlides: this.props.successstories.length,
      });
    }
    if (this.props.partners) {
      this.setState({
        autoPlayPartners: this.props.partners.length > 4,
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateNumberOfSlides);
  }

  updateNumberOfSlides = () => {
    let numberOfSlides = 1;
    let partnersToShow = 2;
    let autoPlay = true;
    if (window.innerWidth <= 470) {
      partnersToShow = 1;
    } else if (window.innerWidth > 470 && window.innerWidth <= 700) {
      partnersToShow = 2;
    } else if (window.innerWidth > 700 && window.innerWidth <= 900) {
      partnersToShow = 3;
      numberOfSlides = 2;
    } else {
      partnersToShow = 4;
      numberOfSlides = 2;
    }
    this.setState({
      numberOfSlides,
      partnersToShow,
      autoPlayPartners: this.props.partners.length > partnersToShow,
    });
  };

  updateCurrentSlide = (factor) => {
    const { currentSlide, totalSlides, numberOfSlides } = this.state;
    if (
      currentSlide + factor >= 0 &&
      currentSlide + factor <= totalSlides - numberOfSlides
    ) {
      console.log(currentSlide + factor);
      this.setState({
        currentSlide: currentSlide + factor,
      });
    }
  };

  afterSlide = (currentSlide) => {
    this.setState({
      currentSlide,
    });
  };

  render() {
    const {
      bannercontent,
      usecases,
      solutions,
      goals,
      partners,
      successstories,
    } = this.props;
    const {
      numberOfSlides,
      currentSlide,
      totalSlides,
      partnersToShow,
      autoPlayPartners,
    } = this.state;
    return (
      <div className="main-home-container">
        <div className="d-flex w-100 flex-wrap align-items-center justify-content-evenly pl py-lg-4 banner-container">
          <div className="h-50c card shadow bg-body rounded px-5">
        <a href="https://xformation-tech-doc.netlify.app/" className="text-capitalize card-text text-primary text-decoration-none">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center">
              <AiFillBook className="fs-icon text"/>
          Technical Guides
              </div>
            </div>
          </a>
          </div>
          {/* <div className="h-50c card shadow bg-body rounded px-5">
          <a href="https://xformation-website.netlify.app/scenario/1" className="text-decoration-none text-capitalize card-text text-primary">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center">
              <AiOutlineBook className="fs-icon text"/>
            Scenario
              </div>
            </div>
            </a>
          </div> */}
          <div className="h-50c card shadow bg-body rounded px-5">
          <a href="https://xformation-website.netlify.app/xformation/xformation/" className="text-decoration-none text-capitalize card-text text-primary">
            <div className="card-body">
              <div className="d-flex flex-column align-items-center justify-content-center">
              <AiFillBook className="fs-icon text"/>
            Xformation
              </div>
            </div>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

IndexPageTemplate.propTypes = {
  bannercontent: PropTypes.object,
  usecases: PropTypes.object,
  solutions: PropTypes.object,
  partners: PropTypes.object,
  goals: PropTypes.object,
  successstories: PropTypes.object,
};

const IndexPage = ({ data }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <Layout>
      <IndexPageTemplate
        bannercontent={frontmatter.bannercontent}
        usecases={frontmatter.usecases}
        solutions={frontmatter.solutions}
        goals={frontmatter.goals}
        partners={frontmatter.partners}
        successstories={frontmatter.successstories}
      />
    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

export const pageQuery = graphql`
  query IndexPageTemplate {
    markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
      frontmatter {
        bannercontent {
          title
          text
          service {
            link
            img
            name
          }
        }
        usecases {
          heading
          cioimage
          teamimage
          ciousecases {
            img
            name
          }
          teamusecases {
            img
            name
          }
        }
        solutions {
          img
          name
          description
          checklist {
            check
          }
        }
        goals {
          heading
          description
          goalslist {
            img
            name
          }
        }
        partners {
          img
        }
        successstories {
          img
          heading
          description
          link
        }
      }
    }
  }
`;

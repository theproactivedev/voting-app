import React from "react";
import Fade from "react-reveal/Fade";
import PropTypes from "prop-types";

const PageTitle = ({ title }) => (
  <div className="header mb-5">
    <div className="container">
      <Fade bottom><h1 className="text-white text-center py-4">{title}</h1></Fade>
    </div>
  </div>
);

PageTitle.propTypes = {
  title: PropTypes.string
};



export default PageTitle;
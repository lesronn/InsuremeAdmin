import React from "react";
import Spinner from "react-bootstrap/Spinner";
import "bootstrap/dist/css/bootstrap.min.css";
import colors from "../../config/colors";

const LoadingSpinner = () => {
  return <Spinner size="sm" animation="border" color={colors.white} />;
};

export default LoadingSpinner;

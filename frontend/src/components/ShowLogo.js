import { useState, useEffect } from "react";
import { CoreAPIGET } from "../dep/core/coreHandler";

function ShowLogo() {
  const [error, setError] = useState("");
  const [data, setData] = useState({
    CompanyLogo: "", // Initialize CompanyLogo with an empty string
  });

  const fetchData = async () => {
    try {
      const response = await CoreAPIGET("setting");
      const jsonData = response.body.Data;
      setData(jsonData);
      setError(null);
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to check if a string is a valid base64 string
  const isValidBase64 = (str) => {
    try {
      // Attempt to decode the base64 string
      atob(str);
      return true; // If successful, it's a valid base64 string
    } catch (e) {
      return false; // If an error occurs, it's not a valid base64 string
    }
  };

  // Function to render the CompanyLogo as an image
  const renderCompanyLogo = () => {
    if (isValidBase64(data.CompanyLogo)) {
      return (
        <img src={`data:image;base64,${data.CompanyLogo}`} alt="Company Logo" />
      );
    } else {
      return null; // If the CompanyLogo is not a valid base64 string, do not render the image
    }
  };

  return (
    <div>
      <div>{renderCompanyLogo()}</div>
    </div>
  );
}

export default ShowLogo;

// pages/api/logo.js
import { CoreAPIBlob } from 'path-to-your-utils-file'; // Update this import statement with the correct path

export default async (req, res) => {
  try {
    // Assuming your backend server provides the logo at a specific endpoint
    const backendLogoPath = 'logo'; // Update this with the correct path on your backend
    // const CategoryID = ''; // Provide the necessary CategoryID if required by your backend

    // Use CoreAPIBlob to fetch the logo from the backend server
    const { status, head, body: logoBlob } = await CoreAPIBlob('GET', backendLogoPath, null);

    // Check if the request to the backend was successful (status code 200)
    if (status === 200) {
      // Convert the logo blob to buffer and send it as the response
      const logoBuffer = await logoBlob.arrayBuffer();
      res.status(200).end(Buffer.from(logoBuffer), 'binary');
    } else {
      // If the request to the backend failed, send an appropriate error status
      res.status(status).end();
    }
  } catch (error) {
    // Handle any errors that occur during the process
    res.status(500).end();
  }
};

import { KmsAPIBlob } from '@/dep/kms/kmsHandler';
// Replace with your file retrieval logic

export default async function handler({ params }, res) {
  const { id } = params.id;
  // Use your logic to get the file path based on the ID
  const response = await KmsAPIBlob('GET', `doc?DocID=${id}`, null);
  // console.log(response);
  for (const [key, value] of response.head.entries()) {
    // console.log(`${key}: ${value}`);
  }
  if (response) {
    // Set appropriate headers for the download
    return response.body;
  }
}

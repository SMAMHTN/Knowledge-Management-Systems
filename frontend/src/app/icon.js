'use server';

import { ImageResponse } from 'next/server';
import Image from 'next/image';
import { CoreAPIGET } from '@/dep/core/coreHandler';

// Route segment config
// export const runtime = 'edge';

// // Image metadata
// export const size = {
//   width: 32,
//   height: 32,
// };
// export const contentType = 'image/png';

// Image generation
export default async function Icon() {
  const response = await CoreAPIGET('setting');
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <Image
        src={`data:image;base64,${response.body.Data.CompanyLogo}`}
        alt="Company Logo"
        height={500}
        width={500}
        style={{
          maxWidth: '32px',
          maxHeight: '32px',
          objectFit: 'contain',
        }}
      />
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      width: 32,
      height: 32,
    },
  );
}

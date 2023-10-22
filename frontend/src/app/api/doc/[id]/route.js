/* eslint-disable new-cap */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { NextResponse } from 'next/server';
import { KmsAPIBlob } from '@/dep/kms/kmsHandler';

export async function GET(req, res) {
  // const params = useParams();
  // console.log(params);
  // console.log(req);
  // console.log(res);
  // console.log(res.params.id);
  try {
    const response = await KmsAPIBlob('GET', `doc?DocID=${res.params.id}`, null);
    // console.log(response);

    if (response && response.body) {
      if (response.status === 200) {
        return new NextResponse(response.body, {
          status: 200,
          statusText: 'OK',
          headers: response.head,
        });
      } if (response.status === 403) {
        return NextResponse.json({
          message: 'you dont have permission',
        }, {
          status: 403,
        });
      } if (response.status === 401) {
        return NextResponse.redirect(new URL('/', req.url));
      }
      return NextResponse.json({
        message: `Got Error from API ${response.status} with header ${response.head} and body ${response.body}`,
      }, {
        status: response.status,
      });
    }
    // Handle the case when response or response.body is undefined
    return NextResponse.json({
      message: `Internal Server Error ${response}`,
    }, {
      status: 500,
    });
  } catch (error) {
    // Handle any other errors that might occur during the request
    return NextResponse.json({
      message: `Internal Server Error : ${error}`,
    }, {
      status: 500,
    });
  }
}

export default GET;

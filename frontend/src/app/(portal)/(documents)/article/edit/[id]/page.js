'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ArticleEditor from '@/dep/grapesjs/ArticleEditor';
import { Separator } from '@/components/SmComponent';
import UploadDoc from '@/components/UploadDoc';
import UploadFile from '@/components/UploadFile';
import { Button } from '@/components/ui/button';
import { URLParamsBuilder } from '@/dep/others/HandleParams';
import { KmsAPIGET } from '@/dep/kms/kmsHandler';

function articleEditing({ params }) {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`article?ArticleID=${params.id}`);
      setData(response.body.Data);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  return (
    <section className="h-screen flex flex-col flex-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1">Add New Article</h2>
        <p className="text-xs mb-4">
          Change the content of your article and upload files and documents.
        </p>
        <Separator className="mb-4" />
        <div className="mb-4">
          <label className="block font-semibold mb-1">Edit Article Content</label>
          <ArticleEditor ProjectID={params.id} />
          <p>
            click here to see how to make an article
            {' '}
            <span className="text-blue-500 underline">links here</span>
          </p>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Document</label>
          <UploadDoc categoryID={data.CategoryID} />
          <label className="block font-semibold mb-1">Upload File</label>
          <UploadFile categoryID={data.CategoryID} />
        </div>
        <Button
          type="button"
          className="rounded bg-blue-500 hover:bg-blue-600 text-white my-4 w-full md:w-36"
        >
          <Link href={URLParamsBuilder('/article')}>
            Publish
          </Link>
        </Button>
      </div>

    </section>
  );
}

export default articleEditing;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/dep/grapesjs/ArticleEditor';
import { Separator } from '@/components/SmComponent';
import UploadDoc from '@/components/UploadDoc';
import UploadFile from '@/components/UploadFile';
import { Button } from '@/components/ui/button';
import { URLParamsBuilder } from '@/dep/others/HandleParams';
import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import ListFile from '@/components/ListFromArray';
import { alertAdd } from '@/components/Feature';

function articleEditing({ params }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [docList, setDocList] = useState([]);
  const AddFile = (value) => {
    // Check if the value is not already in the fileList
    if (!fileList.includes(value)) {
      // Add the value to the fileList
      KmsAPI('PUT', 'article', {
        ArticleID: data.ArticleID,
        FileID: [...fileList, value],
        IsActive: data.IsActive,
      });
      setFileList((prevList) => [...prevList, value]);
    }
  };

  const AddDoc = (value) => {
    // Check if the value is not already in the docList
    if (!docList.includes(value)) {
      // Add the value to the docList
      KmsAPI('PUT', 'article', {
        ArticleID: data.ArticleID,
        DocID: [...docList, value],
        IsActive: data.IsActive,
      });
      setDocList((prevList) => [...prevList, value]);
    }
  };
  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`article?ArticleID=${params.id}`);

      setData(response.body.Data);
      setDocList(response.body.Data.DocID);
      setFileList(response.body.Data.FileID);
    } catch (error) {
      // Handle errors here
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id]);

  const handlePublish = async (e) => {
    e.preventDefault();
    const updatedData = {
      ArticleID: parseInt(params.id, 10),
    };

    const response = await KmsAPI('PUT', 'article/solr', updatedData);
    await new Promise((resolve) => setTimeout(resolve, 300));
    alertAdd(response);
    router.push('/article');
  };

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
          <ArticleEditor ArticleID={data.ArticleID} />
          <p>
            click here to see how to make an article
            {' '}
            <span className="text-blue-500 underline">links here</span>
          </p>
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Document</label>
          <UploadDoc categoryID={data.CategoryID} DocAdd={AddDoc} />
          <p>{docList}</p>
          <ListFile idArray={docList} path="/api/doc/" />
          <label className="block font-semibold mb-1">Upload File</label>
          <UploadFile categoryID={data.CategoryID} FileAdd={AddFile} />
          <p>{fileList}</p>
          <ListFile idArray={fileList} path="/api/file/" />
        </div>
        <Button
          type="button"
          className="rounded bg-blue-500 hover:bg-blue-600 text-white my-4 w-full md:w-36"
          onClick={handlePublish}
        >
          {/* <Link href={URLParamsBuilder('/article')} /> */}
          Publish
        </Button>
      </div>

    </section>
  );
}

export default articleEditing;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ArticleEditor from '@/dep/grapesjs/ArticleEditor';
import { Separator } from '@/components/SmComponent';
import UploadDoc from '@/components/UploadDoc';
import UploadFile from '@/components/UploadFile';
import { Button } from '@/components/ui/button';
import { URLParamsBuilder, HandleQueryParams } from '@/dep/others/HandleParams';
import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { ListFile, ListDoc } from '@/components/ListFromArray';
import { alertAdd, alertDelete } from '@/components/Feature';

function articleEditing({ params }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [docList, setDocList] = useState([]);
  const AddFile = async (value) => {
    // Extract FileID from the object and convert it to an array of integers
    const fileIDs = fileList.map((file) => file.FileID);

    // Check if the FileID is not already in the array
    if (!fileIDs.includes(value)) {
      // Add the FileID to the array
      const updatedFileIDs = [...fileIDs, value];
      KmsAPI('PUT', 'article', {
        ArticleID: data.ArticleID,
        FileID: updatedFileIDs,
        IsActive: data.IsActive,
      });

      // Update the state with the new file list
      const responseFile = await KmsAPIGET(URLParamsBuilder('listfile', 1, 99999999, HandleQueryParams('FileID', 'IN', 'AND', updatedFileIDs), null));
      setFileList(responseFile.body.Data);
    }
  };

  const DeleteFile = async (value) => {
    // Extract FileID from the object and convert it to an array of integers
    const fileIDs = fileList.map((file) => file.FileID);

    // Check if the FileID is in the array
    if (fileIDs.includes(value)) {
      // Remove the FileID from the array
      const updatedFileIDs = fileIDs.filter((id) => id !== value);
      KmsAPI('PUT', 'article', {
        ArticleID: data.ArticleID,
        FileID: updatedFileIDs,
        IsActive: data.IsActive,
      });

      // Update the state with the new file list (excluding the deleted file)
      const responseFile = await KmsAPIGET(URLParamsBuilder('listfile', 1, 99999999, HandleQueryParams('FileID', 'IN', 'AND', updatedFileIDs, null)));
      alertDelete(responseFile);
      setFileList(responseFile.body.Data);
    }
  };

  const AddDoc = async (value) => {
    const docIDs = docList.map((doc) => doc.DocID);

    if (!docIDs.includes(value)) {
      const updatedDocIDs = [...docIDs, value];
      KmsAPI('PUT', 'article', {
        ArticleID: data.ArticleID,
        DocID: updatedDocIDs,
        IsActive: data.IsActive,
      });

      const responseDoc = await KmsAPIGET(URLParamsBuilder('listdoc', 1, 99999999, HandleQueryParams('DocID', 'IN', 'AND', updatedDocIDs), null));
      setDocList(responseDoc.body.Data);
    }
  };

  const DeleteDoc = async (value) => {
    const docIDs = docList.map((doc) => doc.DocID);

    if (docIDs.includes(value)) {
      const updatedDocIDs = docIDs.filter((id) => id !== value);
      KmsAPI('PUT', 'article', {
        ArticleID: data.ArticleID,
        DocID: updatedDocIDs,
        IsActive: data.IsActive,
      });

      const responseDoc = await KmsAPIGET(URLParamsBuilder('listdoc', 1, 99999999, HandleQueryParams('DocID', 'IN', 'AND', updatedDocIDs), null));
      alertDelete(responseDoc);
      setDocList(responseDoc.body.Data);
    }
  };
  const fetchData = async () => {
    try {
      const response = await KmsAPIGET(`article?ArticleID=${params.id}`);

      setData(response.body.Data);
      if (response.body.Data.DocID.length > 0) {
        const responseDoc = await KmsAPIGET(URLParamsBuilder('listdoc', 1, 99999999, HandleQueryParams('DocID', 'IN', 'AND', response.body.Data.DocID), null));
        setDocList(responseDoc.body.Data);
      }
      if (response.body.Data.FileID.length > 0) {
        const responseFile = await KmsAPIGET(URLParamsBuilder('listfile', 1, 99999999, HandleQueryParams('FileID', 'IN', 'AND', response.body.Data.FileID), null));
        setFileList(responseFile.body.Data);
      }
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
          {/* <p>
            click here to see how to make an article
            {' '}
            <span className="text-blue-500 underline">links here</span>
          </p> */}
        </div>
        <div className="mb-4">
          <label className="block font-semibold mb-1">Upload Document</label>
          <UploadDoc categoryID={data.CategoryID} DocAdd={AddDoc} />
          <ListDoc idArray={docList} path="/api/doc/" DocDel={DeleteDoc} />
          <label className="block font-semibold mb-1">Upload File</label>
          <UploadFile categoryID={data.CategoryID} FileAdd={AddFile} />
          <ListFile idArray={fileList} path="/api/file/" FileDel={DeleteFile} />
        </div>
        <Button
          type="button"
          className="rounded bg-blue-500 hover:bg-blue-600 text-white my-4 w-full md:w-36 shadow"
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

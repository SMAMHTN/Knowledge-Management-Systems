'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Loader2 } from 'lucide-react';
import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { alertUpdate } from '@/components/Feature';
import UploadDoc from '@/components/UploadDoc';
import UploadFile from '@/components/UploadFile';
import ArticleEditor from '@/dep/grapesjs/ArticleEditor';
import { URLParamsBuilder } from '@/dep/others/HandleParams';
import { Button } from '@/components/ui/button';
import { RequiredFieldIndicator, ErrorMessage, Separator } from '@/components/SmComponent';
import { articleSchema } from '@/constants/schema';
import CategorySelector from '@/components/select/CategorySelector';
import ListFile from '@/components/ListFromArray';

function ArticleDetail({ params }) {
  const router = useRouter();
  const [data, setData] = useState([]);
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      ArticleID: '',
      Tag: '',
      Title: '',
      CategoryID: '',
      IsActive: false,
    },
    resolver: yupResolver(articleSchema),
  });

  const [selectedCategory, setSelectedCategory] = useState({
    value: 1,
    label: 'Public',
  });
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

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
      const { Data } = response.body;

      Object.keys(Data).forEach((key) => {
        setValue(key, Data[key]);
      });
      setSelectedCategory({
        value: response.body.Data.CategoryID,
        label: response.body.Data.CategoryName,
      });
    } catch (error) {
      // Handle errors here
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [params.id, setValue]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      const { error } = articleSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }
      // convert tag into array before sent to server
      const stringArrayTag = formData.Tag
        ? formData.Tag.split(',').map((item) => item.trim()).filter((item) => item !== '')
        : [];

      const updatedData = {
        ArticleID: formData.ArticleID,
        Title: formData.Title,
        Tag: stringArrayTag,
        CategoryID: selectedCategory.value,
        IsActive: formData.IsActive,
      };
      const indexingID = {
        ArticleID: parseInt(params.id, 10),
      };

      const response = await KmsAPI('PUT', 'article', updatedData);
      const indexing = await KmsAPI('PUT', 'article/solr', indexingID);
      // console.log('----indexing-----------------------------------');
      // console.log(indexing);
      // console.log('----response-----------------------------------');
      console.log(response);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-screen flex flex-col flex-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1">Edit Article</h2>
        <p className="text-xs mb-4">
          Change the content of your article and upload files and documents.
        </p>
        <Separator className="mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Article Title
              <RequiredFieldIndicator />
            </label>
            <Controller
              name="Title"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="Public"
                  />
                  <p className="text-xs mt-1">
                    Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.Title && (<ErrorMessage error={errors.Title.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-6">
            <label className="block font-medium mb-1">
              Category
              {' '}
              <RequiredFieldIndicator />
            </label>
            <CategorySelector onChange={handleCategoryChange} value={selectedCategory} />
            <p className="text-xs mt-1">
              Select category. Required.
            </p>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">Tags</label>
            <Controller
              name="Tag"
              control={control}
              render={({ field }) => (
                <>
                  <textarea
                    {...field}
                    type="textarea"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                    placeholder="Designed for public"
                  />
                  <p className="text-xs mt-1">
                    Write with commas to separate new tags
                  </p>
                  <p className="text-xs mt-1">
                    Example : 2021, Money, Advice
                  </p>
                  {errors.Tag && (<ErrorMessage error={errors.Tag.message} />)}
                </>
              )}
            />
          </div>
          <div>
            <Controller
              name="IsActive"
              control={control}
              render={({ field }) => (
                <div className="flex items-center my-2 md:my-0">
                  <input
                    {...field}
                    type="checkbox"
                    checked={field.value}
                    className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4"
                  />
                  <span className="text-sm sm:text-base">Active</span>
                </div>
              )}
            />
          </div>
          <div className="mb-4 mt-20">
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
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white w-full md:w-36 my-2 mb-4"
          >
            {isSubmitting ? (<Loader2 className="animate-spin mr-2" size={16} />) : null}
            {isSubmitting ? ('Publishing') : ('Publish')}
          </Button>
        </form>
      </div>

    </section>
  );
}

export default ArticleDetail;

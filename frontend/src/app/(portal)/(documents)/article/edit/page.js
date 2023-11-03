'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { KmsAPI } from '@/dep/kms/kmsHandler';
import { alertAdd } from '@/components/Feature';
import { Button } from '@/components/ui/button';
import { RequiredFieldIndicator, ErrorMessage, Separator } from '@/components/SmComponent';
import { articleSchema } from '@/constants/schema';
import CategorySelector from '@/components/select/CategorySelector';
import { URLParamsBuilder } from '@/dep/others/HandleParams';

function AddArticle() {
  const router = useRouter();
  const {
    handleSubmit, control, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
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
        Title: formData.Title,
        Tag: stringArrayTag,
        CategoryID: selectedCategory.value,
        IsActive: formData.IsActive,
      };
      const response = await KmsAPI('POST', 'article', updatedData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertAdd(response);
      const nextPage = response.body.Data.ArticleID;
      const status = response.body.StatusCode;
      if (status === 200) {
        router.push(
          URLParamsBuilder(`edit/${nextPage}`),
        );
      }
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-screen flex flex-col flex-auto">
      <div className="flex flex-col">
        <h2 className="text-2xl font-semibold mb-1">Add New Article</h2>
        <p className="text-xs mb-4">
          Customize and manage your Article details.
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
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md shadow"
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
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md shadow"
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
                    className="mr-2 text-blue-500 w-6 h-6 md:w-4 md:h-4 shadow"
                  />
                  <span className="text-sm sm:text-base">Active</span>
                </div>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 hover:bg-blue-600 text-white mt-2 w-full md:w-36 shadow"
          >
            Next
          </Button>
        </form>
      </div>
    </section>
  );
}

export default AddArticle;

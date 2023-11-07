'use client';

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { alertUpdate } from '@/components/Feature';
import { catSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator, Separator } from '@/components/SmComponent';
import { Button } from '@/components/ui/button';
import CategorySelector from '@/components/select/CategorySelector';

function CategoryDetail({ params }) {
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CategoryID: '',
      CategoryName: '',
      CategoryDescription: '',
    },
    resolver: yupResolver(catSchema),
  });

  const [selectedCategory, setSelectedCategory] = useState({
    value: 1,
    label: 'Public',
  });
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await KmsAPIGET(`category?CategoryID=${params.id}`);
        const { Data } = response.body;

        Object.keys(Data).forEach((key) => {
          setValue(key, Data[key]);
        });
        setSelectedCategory({
          value: response.body.Data.CategoryParentID,
          label: response.body.Data.CategoryParentName,
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [params.id, setValue]);

  const onSubmit = async (formData, e) => {
    e.preventDefault();
    try {
      const { error } = catSchema.validate(formData);

      if (error) {
        console.error('Validation error:', error.details);
        return;
      }

      const updatedData = {
        CategoryID: formData.CategoryID,
        CategoryName: formData.CategoryName,
        CategoryParentID: selectedCategory.value,
        CategoryDescription: formData.CategoryDescription,
      };

      const response = await KmsAPI('PUT', 'category', updatedData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-fit flex flex-auto w-full">
      <div className="flex flex-col w-full">
        <div className="bg-white w-full rounded-md shadow px-4 py-2 mb-2">
          <h2 className="text-2xl font-semibold mb-1">Edit Category</h2>
          <p className="text-xs mb-1">
            Customize and manage your category details.
          </p>
          <Separator />
        </div>
        <div className="bg-white rounded-md shadow p-4">
          <div className="md:w-4/5 lg:w-3/4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Category
                  <RequiredFieldIndicator />
                </label>
                <Controller
                  name="CategoryName"
                  control={control}
                  render={({ field }) => (
                    <>
                      <input
                        {...field}
                        type="text"
                        className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md shadow"
                        placeholder="Parent"
                      />
                      <p className="text-xs mt-1">
                        Min 2 characters & Max 50 characters. Required.
                      </p>
                      {errors.CategoryName && (<ErrorMessage error={errors.CategoryName.message} />)}
                    </>
                  )}
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">
                  Category Parent
                  <RequiredFieldIndicator />
                </label>
                <CategorySelector onChange={handleCategoryChange} value={selectedCategory} />
                <p className="text-xs mt-1">
                  Select category. Required.
                </p>
              </div>
              <div className="mb-4">
                <label className="block font-medium mb-1">Description</label>
                <Controller
                  name="CategoryDescription"
                  control={control}
                  render={({ field }) => (
                    <>
                      <textarea
                        {...field}
                        type="textarea"
                        className="text-sm sm:text-base placeholder-gray-500 px-2  py-1 border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y md:max-w-md shadow"
                        placeholder="This is a Parent category that does...."
                      />
                      <p className="text-xs mt-1">
                        Give a brief explanation of the category.
                      </p>
                      {errors.CategoryDescription && (<ErrorMessage error={errors.CategoryDescription.message} />)}
                    </>
                  )}
                />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded bg-blue-500 text-white w-full md:w-36 shadow"
              >
                Update Category
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CategoryDetail;

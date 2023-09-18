'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { alertUpdate } from '@/components/Feature';
import { catSchema } from '@/constants/schema';
import { ErrorMessage, RequiredFieldIndicator } from '@/components/FormComponent';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

function CategoryDetail({ params }) {
  const {
    handleSubmit, control, setValue, formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      CategoryID: '',
      CategoryName: '',
      CategoryParentID: '',
      CategoryDescription: '',
    },
    resolver: yupResolver(catSchema),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await KmsAPIGET(`category?CategoryID=${params.id}`);
        const { Data } = response.body;

        Object.keys(Data).forEach((key) => {
          setValue(key, Data[key]);
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

      const response = await KmsAPI('PUT', 'category', formData);
      await new Promise((resolve) => setTimeout(resolve, 300));
      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <section className="h-screen flex flex-auto w-full md:w-4/5 lg:w-3/4">
      <div className="flex flex-col w-full">
        <h2 className="text-2xl font-semibold mb-1">Category Edit</h2>
        <p className="text-xs mb-4">
          Customize and manage your category details.
        </p>
        <Separator className="mb-4" />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Category Name
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
                    className="text-sm sm:text-base placeholder-gray-500 px-2 py-1 rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 md:max-w-md"
                    placeholder="Category Name"
                  />
                  <p className="text-xs mt-1">
                    This is Category Name. Min 2 characters & Max 50 characters. Required.
                  </p>
                  {errors.CategoryName && (<ErrorMessage error={errors.CategoryName.message} />)}
                </>
              )}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Category Parent ID
              <RequiredFieldIndicator />
            </label>
            <Controller
              name="CategoryParentID"
              control={control}
              render={({ field }) => (
                <>
                  <input
                    {...field}
                    type="text"
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400  md:max-w-md"
                    placeholder="Category Parent ID"
                  />
                  <p className="text-xs mt-1">
                    This is Category Parent ID. Number Only. Required.
                  </p>
                  {errors.CategoryParentID && (<ErrorMessage error={errors.CategoryParentID.message} />)}
                </>
              )}
            />
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
                    className="text-sm sm:text-base placeholder-gray-500 px-2  py-1  rounded border border-gray-400 w-full focus:outline-none focus:border-blue-400 min-h-[4rem] rounded resize-y  md:max-w-md"
                    placeholder="Category Description"
                  />
                  <p className="text-xs mt-1">
                    Give a brief explanation of the category
                  </p>
                  {errors.CategoryDescription && (<ErrorMessage error={errors.CategoryDescription.message} />)}
                </>
              )}
            />
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-500 text-white"
          >
            Update Category
          </Button>
        </form>
      </div>
    </section>
  );
}

export default CategoryDetail;

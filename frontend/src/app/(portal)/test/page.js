'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { KmsAPI, KmsAPIGET } from '@/dep/kms/kmsHandler';
import { alertUpdate } from '@/components/Feature';
import { catSchema } from '@/constants/schema';
import { Button } from '@/components/ui/button';

function testPage({ params }) {
  const {
    handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting },
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
        const response = await KmsAPIGET('category?CategoryID=2');
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
      await new Promise((resolve) => setTimeout(resolve, 500));
      alertUpdate(response);
    } catch (error) {
      console.log(error);
      console.log('An error occurred');
    }
  };

  return (
    <Form>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={control} // Use control directly
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export default testPage;

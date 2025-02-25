"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ICityInput {
  onSubmitCity: (city: string) => void;
}

const CityInput: React.FC<ICityInput> = ({ onSubmitCity }) => {
  const [isLoading, setIsLoading] = useState(false);
  const FormSchema = z.object({
    city: z.string().min(2, {
      message: "City must be at least 2 characters.",
    }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      city: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      await onSubmitCity(data.city);
    } finally {
      setIsLoading(false);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">City</FormLabel>
              <FormControl>
                <div className="flex">
                  <Input
                    className="flex-1 mr-2"
                    placeholder="Moscow"
                    {...field}
                  />
                  <Button type="submit" className="w-20">
                    {isLoading ? "Loading" : "Add"}
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                Select a city to check the weather.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CityInput;

"use client";
import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
interface ICitiesList {
  cities: string[];
  hideCitiesOnChart: (cities: string[]) => void;
  clearData: () => void;
}

const FormSchema = z.object({
  cities: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one city.",
  }),
});

const CitiesList: React.FC<ICitiesList> = ({
  cities,
  hideCitiesOnChart,
  clearData,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      cities: [],
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (form.watch("cities")?.length === cities.length) {
      clearData();
    } else hideCitiesOnChart(data.cities);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="cities"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">City</FormLabel>
                <FormDescription>
                  Select the cities you dont want to see on the chart.
                </FormDescription>
              </div>
              {cities.map((city) => (
                <FormField
                  key={city}
                  control={form.control}
                  name="cities"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={city}
                        className="flex flex-row items-center space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(city)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, city])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== city
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="flex self-end font-normal capitalize cursor-pointer">
                          {city}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant={"destructive"} type="submit">
          {form.watch("cities")?.length === cities.length
            ? "Reset Chart"
            : "Hide"}
        </Button>
      </form>
    </Form>
  );
};

export default CitiesList;

"use client";

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
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  key: z.string(),
});
const ApiKeyInput: React.FC<{ setApiKey: (key: string) => void }> = ({
  setApiKey,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      key: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    localStorage.setItem("apiKey", data.key);
    setApiKey(data.key);
  }

  return (
    <div className="flex justify-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[400px] space-y-6"
        >
          <FormField
            control={form.control}
            name="key"
            render={({ field }) => (
              <FormItem>
                <FormLabel>API Key</FormLabel>
                <FormControl>
                  <Input placeholder="84b79da..." {...field} />
                </FormControl>
                <FormDescription>
                  To continue, please enter your API key.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ApiKeyInput;

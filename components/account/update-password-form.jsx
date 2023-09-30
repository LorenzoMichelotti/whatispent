"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "../ui/button";
import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { LoaderIcon } from "lucide-react";
import { toast } from "../ui/use-toast";

const formSchema = z.object({
  password: z.string().min(6).max(150),
});

export default function UpdatePasswordForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(values) {
    updatePassword(values);
  }

  async function updatePassword(values) {
    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      password: values.password,
    });
    if (error) {
      console.log(error);
      setIsLoading(false);
      return;
    }
    console.log(data);
    toast({
      title: "Password updated",
      description: "please login again",
    });
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Refreshing...",
      });
    }
    router.push("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full flex flex-col"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="password"
                  placeholder="******"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between">
          <Button type="submit">
            {isLoading ? (
              <LoaderIcon className="animate-spin"></LoaderIcon>
            ) : (
              "Update"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

"use client";
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
  email: z.string().min(4).max(150),
  password: z.string().min(6).max(150),
});

export default function LoginForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(isLogin, values) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    authenticate(isLogin, values);
  }

  async function signInWithEmail(values) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: error.message,
      });
      setIsLoading(false);
      return;
    }
    console.log(data);
    router.push("/auth/callback");
  }

  async function signUpWithEmail(values) {
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });
    if (error) {
      console.log(error);
      setIsLoading(false);
      return;
    }
    console.log(data);
    router.push("/auth/callback");
  }

  async function authenticate(isLogin, values) {
    setIsLoading(true);
    if (!values || !values?.password || !values?.email) return;
    if (isLogin) {
      signInWithEmail(values);
    } else {
      signUpWithEmail(values);
    }
  }

  return (
    <Form {...form}>
      <div className="mb-4">
        <span className=" text-slate-600">
          {isLogin ? "Log-in to your account" : "Creating new account"}
        </span>
      </div>
      <form
        onSubmit={form.handleSubmit((values) => onSubmit(isLogin, values))}
        className="space-y-8 flex flex-col"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="johnwick@gmail.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
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
          <Button
            onClick={() => setIsLogin((prev) => !prev)}
            variant="link"
            type="button"
            className="px-0"
          >
            {isLogin ? "Create an account" : "Login instead"}
          </Button>
          <Button type="submit">
            {isLoading ? (
              <LoaderIcon className="animate-spin"></LoaderIcon>
            ) : isLogin ? (
              "Login"
            ) : (
              "SignUp"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

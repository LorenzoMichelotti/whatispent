"use client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

export default function AuthForm() {
  const supabase = createClientComponentClient();
  const [isMagicLink, setIsMagicLink] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="w-full flex flex-col justify-center items-center">
      <h1 className="text-2xl mb-4">whatispent</h1>
      {!isMagicLink && (
        <div className="flex flex-col justify-center items-center w-full">
          <Auth
            supabaseClient={supabase}
            view={isLogin ? "sign_in" : "sign_up"}
            appearance={{ theme: ThemeSupa }}
            theme="light"
            showLinks={false}
            providers={[]}
          />

          <Button
            className="text-blue-600"
            onClick={() => setIsLogin((prev) => !prev)}
            variant="link"
          >
            {isLogin ? "Create an Account" : "Sign In instead"}
          </Button>
        </div>
      )}
      {isMagicLink && (
        <Auth
          supabaseClient={supabase}
          view="magic_link"
          appearance={{ theme: ThemeSupa }}
          theme="light"
          showLinks={false}
          providers={[]}
        />
      )}
      <Button
        className="text-purple-600"
        onClick={() => setIsMagicLink((prev) => !prev)}
        variant="link"
      >
        {isMagicLink ? "Use a password instead" : "Or Login with a magic link"}
      </Button>
    </div>
  );
}

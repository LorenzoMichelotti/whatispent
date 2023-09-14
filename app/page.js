import AuthForm from "@/components/auth-form";

export default function Home() {
  return (
    <div className="w-1/2 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <h1 className="text-2xl mb-8">whatispent</h1>
      <AuthForm></AuthForm>
    </div>
  );
}

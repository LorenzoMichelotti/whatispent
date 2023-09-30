import LoginForm from "@/components/account/login-form";
import Title from "@/components/title";

export default function Home() {
  return (
    <div className="w-2/3 sm:w-1/2 md:w-1/3 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <Title></Title>
      <LoginForm></LoginForm>
    </div>
  );
}

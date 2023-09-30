import LoginForm from "@/components/account/login-form";
import Title from "@/components/title";

export default function Home() {
  return (
    <div className="w-[75vw] sm:w-2/3 lg:w-1/2 xl:w-1/3 fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
      <Title></Title>
      <LoginForm></LoginForm>
    </div>
  );
}

import Title from "@/components/title";
import Transactions from "@/components/transactions";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function Account() {
  const supabase = createServerComponentClient({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <div className="md:px-12 w-full pt-4">
      <div className="w-full grid grid-cols-2 auto-cols-fr">
        <h1 className="text-2xl">Transactions</h1>
        <p className="text-slate-500 col-span-2">
          youre logged in as {session?.user.email}
        </p>
      </div>
      <Transactions session={session}></Transactions>
    </div>
  );
}

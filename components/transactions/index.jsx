"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import DataTable from "./data-table";
import AddTransactionModal from "./add-transaction";

export default function Transactions({ session }) {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const user = session?.user;

  const getTransactions = useCallback(async () => {
    try {
      setLoading(true);

      let { data, error, status } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("user_id", user?.id)
        .range(0, 25)
        .order("created_at", { ascending: false });

      if (error && status !== 406) {
        throw error;
      }

      if (status === 406) {
        toast({
          variant: "outline",
          title: "No transactions found 🔎",
          description:
            "Try adding your first transaction pressing the button in the middle of the screen",
        });
      }

      if (data) {
        setTransactions(data);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [user, supabase, toast]);

  async function updateTransaction(transaction, modalTriggerRef) {
    try {
      setLoading(true);

      console.log(transaction);
      let { error } = await supabase.from("transactions").upsert({
        user_id: user.id,
        description: transaction.description,
        amount: transaction.amount,
        bank_name: transaction.bank_name,
      });
      if (error) throw error;
      toast({
        variant: "outline",
        title: "Success ✅",
        description: "Added/Modified the transaction",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating the transaction ❗",
        description:
          "There was a problem while updating/inserting the transaction",
      });
    } finally {
      setLoading(false);
      if (modalTriggerRef) modalTriggerRef.current.click();
      getTransactions();
    }
  }

  useEffect(() => {
    getTransactions();
  }, [user, getTransactions]);

  const columns = [
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at");
        const formatted = new Date(createdAt).toLocaleString();

        return <div className="text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount);

        return <div className="text-right font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "bank_name",
      header: "Bank",
    },
  ];

  return (
    <div className="mt-8 w-full flex flex-col">
      <div className="ml-auto mb-4">
        <AddTransactionModal
          updateTransaction={updateTransaction}
        ></AddTransactionModal>
      </div>
      {transactions && <DataTable columns={columns} data={transactions} />}
      {!transactions && (
        <div className="p-8 rounded-lg border flex justify-center items-center">
          no transactions
        </div>
      )}
    </div>
  );
}

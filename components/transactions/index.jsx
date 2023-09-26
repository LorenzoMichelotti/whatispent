"use client";
import { useCallback, useContext, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import DataTable from "./data-table";
import AddTransactionModal from "./add-transaction";
import { TooltipProvider } from "../ui/tooltip";
import DataTableActionButton from "./data-table-action-button";
import CategoryIcon from "./categories/category-icon";
import TransactionChartCard from "./reports/transaction-chart-card";
import { PreferenceContext } from "../navigation/hide-money-button";

/**
 * @typedef Transaction
 * @property {number} id
 * @property {string} description
 * @property {string} [bank_name]
 * @property {string} created_at
 * @property {number} amount
 * @property {number} category_id
 */
//

export default function Transactions({ session }) {
  const [transactions, setTransactions] = useState();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  const user = session?.user;
  const preferences = useContext(PreferenceContext);

  const getTransactions = useCallback(async () => {
    try {
      let { data, error, status } = await supabase
        .from("transactions")
        .select("*", { count: "exact" })
        .eq("user_id", user?.id)
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
      toast({
        variant: "destructive",
        title: "Error fetching transactions",
        description: "please wait while were trying to fix this issue",
      });
    }
  }, [user, supabase, toast]);

  async function updateTransaction(
    /** @type {Transaction} */ transaction,
    modalTriggerRef
  ) {
    try {
      let { error } = await supabase.from("transactions").upsert({
        user_id: user.id,
        description: transaction.description,
        amount: transaction.amount,
        bank_name: transaction.bank_name,
        created_at: transaction.created_at || undefined,
        category_id: transaction.category_id,
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
      if (modalTriggerRef) modalTriggerRef.current.click();
      getTransactions();
    }
  }

  async function deleteTransaction(transactionId) {
    try {
      let { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);
      if (error) throw error;
      toast({
        variant: "destructive",
        title: "Transaction was deleted successfully❗",
      });
    } catch (error) {
      toast({
        variant: "outline",
        title: "Error updating the transaction ❗",
        description: "The transaction was not deleted, please try again",
      });
    } finally {
      getTransactions();
    }
  }

  useEffect(() => {
    getTransactions();
  }, [user, getTransactions]);

  const columns = [
    {
      accessorKey: "category_id",
      enableHiding: false,
      header: "Tag",
      cell: ({ row }) => {
        return <CategoryIcon row={row} />;
      },
    },
    {
      accessorKey: "created_at",
      header: "Date",
      cell: ({ row }) => {
        const createdAt = row.getValue("created_at");
        const formatted = new Date(createdAt).toLocaleDateString();

        return <div className="text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Desc",
      cell: ({ row }) => {
        return (
          <div className="max-w-[3rem] sm:max-w-[15rem] truncate">
            {row.getValue("description")}
          </div>
        );
      },
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

        return (
          <div className="text-right font-medium">
            {preferences?.hideMoney ? "---" : formatted}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: <div className="text-center">Act</div>,
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="w-full flex justify-center">
            <DataTableActionButton
              editTransaction={updateTransaction}
              deleteTransaction={deleteTransaction}
              transaction={transaction}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className="mt-8 w-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 auto-cols-fr mb-4">
        <TransactionChartCard
          transactions={transactions}
        ></TransactionChartCard>
      </div>
      <TooltipProvider>
        <div className="ml-auto mb-4">
          <AddTransactionModal
            updateTransaction={updateTransaction}
          ></AddTransactionModal>
        </div>
        <DataTable columns={columns} data={transactions} />
      </TooltipProvider>
    </div>
  );
}

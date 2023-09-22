"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useToast } from "@/components/ui/use-toast";
import DataTable from "./data-table";
import AddTransactionModal from "./add-transaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { CopyIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import ReportCard from "./reports/report-card";
import ChartCard from "./reports/chart-card";
import {
  categoryEnumerator,
  categoryStyles,
} from "./categories/category-styles";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { motion } from "framer-motion";

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

  async function updateTransaction(
    /** @type {Transaction} */ transaction,
    modalTriggerRef
  ) {
    try {
      setLoading(true);

      console.log(transaction);
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
      setLoading(false);
      if (modalTriggerRef) modalTriggerRef.current.click();
      getTransactions();
    }
  }

  async function deleteTransaction(transactionId) {
    try {
      setLoading(true);

      console.log(transactionId);
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
      setLoading(false);
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
        const formatted = new Date(createdAt).toLocaleDateString();

        return <div className="text-left font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "category_id",
      header: "Tag",
      cell: ({ row }) => {
        const categoryStyle = categoryEnumerator[row.getValue("category_id")];
        const className = categoryStyle.className;
        const Icon = categoryStyle.icon;
        return (
          <Tooltip>
            <TooltipTrigger className="cursor-default ">
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className={cn(
                  "text-right font-medium rounded-full w-8 aspect-square flex justify-center items-center",
                  className
                )}
              >
                <Icon size={18}></Icon>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{categoryStyle.name}</p>
            </TooltipContent>
          </Tooltip>
        );
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
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                aria-label="Options"
                variant="ghost"
                className="h-8 w-8 p-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                className="flex justify-between items-center"
                onClick={() => navigator.clipboard.writeText(transaction.id)}
              >
                <span>Copy transaction ID</span>
                <CopyIcon size={14} className="ml-2 mt-[0.1rem]"></CopyIcon>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => deleteTransaction(transaction.id)}
                className="flex text-red-600 focus:text-red-600 focus:bg-red-100 dark:focus:bg-red-500/20 justify-between items-center"
              >
                <span>Delete</span>
                <TrashIcon size={14}></TrashIcon>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const months = {
    1: "jan",
    2: "feb",
    3: "mar",
    4: "apr",
    5: "may",
    6: "jun",
    7: "jul",
    8: "aug",
    9: "sep",
    10: "okt",
    11: "nov",
    12: "dec",
  };

  return (
    <div className="mt-8 w-full flex flex-col">
      <div className="grid grid-cols-3 gap-2 auto-cols-fr mb-4">
        <ChartCard
          data={Object.entries(months).map((month) => ({
            name: month[1],
            total:
              transactions &&
              transactions
                ?.filter(
                  (transaction) =>
                    new Date(transaction.created_at).getMonth() + 1 == month[0]
                )
                .map((transaction) => transaction.amount)
                .reduce((prev, next) => prev + next, 0),
          }))}
        ></ChartCard>
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

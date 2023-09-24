import { MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { CopyIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import EditTransactionModal from "./edit-transaction";

export default function DataTableActionButton({
  transaction,
  deleteTransaction,
  editTransaction,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Options" variant="ghost" className="h-8 w-8 p-0">
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
        <DropdownMenuItem asChild className="flex justify-between items-center">
          <EditTransactionModal
            updateTransaction={editTransaction}
            transactionToUpdate={transaction}
          ></EditTransactionModal>
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
}

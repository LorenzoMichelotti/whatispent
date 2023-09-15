import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { DatePicker } from "../ui/DatePicker";

export default function AddTransactionModal({ updateTransaction }) {
  const transactionInitialState = {
    description: "",
    bank_name: "",
    amount: "",
  };

  const [transaction, setTransaction] = useState(transactionInitialState);
  const triggerRef = useRef();
  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger ref={triggerRef} asChild>
        <Button>Add transaction</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add/Modify Transaction</DialogTitle>
        </DialogHeader>

        <form
          action="POST"
          onSubmit={(e) => {
            e.preventDefault();
            console.log(transaction);
            if (
              !transaction?.description ||
              !transaction?.amount ||
              !transaction?.bank_name
            ) {
              toast({
                variant: "outline",
                title: "No fields should be blank ⚠️",
                description: "Please fill in the transaction details",
              });
              return;
            }
            updateTransaction(transaction, triggerRef);
            setTransaction(transactionInitialState);
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="created_at" className="text-right">
                Date
              </Label>
              <DatePicker
                onChange={(date) =>
                  setTransaction((prev) => ({
                    ...prev,
                    created_at: date,
                  }))
                }
                className="col-span-3"
              ></DatePicker>
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                value={transaction.description}
                id="description"
                placeholder="Super market"
                className="col-span-3"
              />
              <Label htmlFor="amount" className="text-right">
                Amount (R$)
              </Label>
              <Input
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                value={transaction.amount}
                title="Examples: 0,50; 1.99; 20; 0;"
                type="number"
                id="amount"
                placeholder="00.00"
                className="col-span-3"
              />
              <Label htmlFor="bank_name" className="text-right">
                Bank name
              </Label>
              <Input
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    bank_name: e.target.value,
                  }))
                }
                value={transaction.bank_name}
                id="bank_name"
                placeholder="Nubank"
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="ml-auto" type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

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

export default function AddTransactionModal({ updateTransaction }) {
  const [transaction, setTransaction] = useState({});
  const triggerRef = useRef();
  const { toast } = useToast();

  return (
    <Dialog>
      <DialogTrigger ref={triggerRef}>
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
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={transaction.description}
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Super market"
                className="col-span-3"
              />
              <Label htmlFor="amount" className="text-right">
                Amount (R$)
              </Label>
              <Input
                id="amount"
                type="number"
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    amount: e.target.value,
                  }))
                }
                prefix="R$ "
                value={transaction.amount}
                placeholder="00.00"
                className="col-span-3"
              />
              <Label htmlFor="bank_name" className="text-right">
                Bank name
              </Label>
              <Input
                id="bank_name"
                onChange={(e) =>
                  setTransaction((prev) => ({
                    ...prev,
                    bank_name: e.target.value,
                  }))
                }
                value={transaction.bank_name}
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

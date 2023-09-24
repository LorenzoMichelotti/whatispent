"use client";

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
import { useCallback, useRef, useState } from "react";
import { useToast } from "../ui/use-toast";
import { DatePicker } from "../ui/DatePicker";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  categoryEnumerator,
  categoryStyles,
} from "./categories/category-styles";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Pencil } from "lucide-react";

/**
 * @typedef Category
 * @property {number} id
 * @property {string} name
 * @property {number} [description]
 * @property {string} created_at
 */
//

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

export default function EditTransactionModal({
  updateTransaction,
  transactionToUpdate,
}) {
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState({
    id: "General",
    Icon: categoryStyles["General"]?.icon,
    className: categoryStyles["General"]?.className,
  });
  const [categories, setCategories] = useState(
    /** @type {Category[]} */ (null)
  );

  /** @type {Transaction} */
  const transactionInitialState = {
    description: "",
    bank_name: "",
    amount: "",
    created_at: new Date(),
    category_id: "1",
    id: undefined,
  };
  const [transaction, setTransaction] = useState(
    /** @type {Transaction} */ (transactionInitialState)
  );

  const triggerRef = useRef(null);
  const { toast } = useToast();
  const supabase = createClientComponentClient();

  const getCategories = useCallback(async () => {
    try {
      setLoadingCategories(true);
      let { data, error, status } = await supabase
        .from("categories")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        console.log(data);
        setCategories(data);
      }
    } catch (error) {
    } finally {
      setLoadingCategories(false);
    }
  }, [supabase]);

  function selectCategory(/** @type string */ catName) {
    console.log(catName);
    if (!catName || catName === "" || catName.length <= 0) return;
    if (!categoryStyles[catName]) return;
    setSelectedCategory({
      id: catName,
      Icon: categoryStyles[catName].icon,
      className: categoryStyles[catName].className,
    });
    setTransaction((prev) => ({
      ...prev,
      category_id: categories.find((c) => c.name == catName).id,
    }));
  }

  const getTransactionToUpdate = useCallback(() => {
    if (!transactionToUpdate) {
      return;
    }
    console.log(transactionToUpdate);
    setTransaction(transactionToUpdate);

    let category = categoryEnumerator[transactionToUpdate.category_id];

    if (!category) return;
    setSelectedCategory({
      id: category.name,
      Icon: category.icon,
      className: category.className,
    });
  }, [transactionToUpdate]);

  return (
    <Dialog
      onOpenChange={() => {
        getTransactionToUpdate();
        getCategories();
      }}
    >
      <DialogTrigger ref={triggerRef} asChild>
        <div className="flex justify-between items-center w-full py-1 px-2 text-md text-[14px] hover:bg-slate-100 rounded-sm transition-colors">
          <span>Edit</span>
          <Pencil size={14}></Pencil>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex w-full">Editing Transaction</DialogTitle>
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
              <Label htmlFor="description" className="text-right">
                Category
              </Label>
              <div className="col-span-3 grid grid-cols-6 grid-flow-col">
                <Select
                  disabled={loadingCategories}
                  value={selectedCategory.id}
                  onValueChange={(value) => selectCategory(value)}
                >
                  <SelectTrigger className="col-span-5">
                    <SelectValue placeholder={"General"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((/** @type {Category} */ category) => {
                      return (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {selectedCategory?.Icon && (
                  <motion.div
                    animate={{ scale: [0.8, 1], opacity: [0.8, 1] }}
                    key={selectedCategory.id}
                    className={cn(
                      "col-span-1 w-10 rounded-full mx-auto aspect-square flex items-center justify-center",
                      selectedCategory.className
                    )}
                  >
                    <selectedCategory.Icon></selectedCategory.Icon>
                  </motion.div>
                )}
              </div>

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
              <Label htmlFor="created_at" className="text-right">
                Date
              </Label>
              <DatePicker
                date={new Date(transaction.created_at)}
                placeholder="AA"
                className="col-span-3"
              ></DatePicker>
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

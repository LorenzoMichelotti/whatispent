"use client";

import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TransactionChartCard({ transactions }) {
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

  const data = Object.entries(months).map((month) => ({
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
  }));

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardDescription>By month</CardDescription>
      </CardHeader>
      <CardContent className="pl-0 -ml-2 pb-2">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$${value}`}
            />
            <Tooltip formatter={(value) => `R$${value.toFixed(2)}`} />
            <Bar
              background={{ fillOpacity: 0 }}
              dataKey="total"
              fill="#adfa1d"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

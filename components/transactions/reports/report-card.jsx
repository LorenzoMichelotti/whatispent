import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ReportCard({ value, title }) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 pt-8">
        <CardTitle className="text-3xl">R$ {value}</CardTitle>
      </CardHeader>
      <CardFooter className="pb-0">
        <CardDescription>{title}</CardDescription>
      </CardFooter>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}
const DashboardCard = ({ title, subtitle, children }: DashboardCardProps) => {
  return (
    <Card className="w-[360px] max-w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && (
          <CardDescription className="overflow-hidden text-ellipsis">
            {subtitle}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="-mt-4">{children}</CardContent>
    </Card>
  );
};
export default DashboardCard;

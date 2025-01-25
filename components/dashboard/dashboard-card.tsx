import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  isVisible: boolean;
}
const DashboardCard = ({
  title,
  subtitle,
  children,
  isVisible,
}: DashboardCardProps) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default DashboardCard;

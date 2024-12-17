import { type LucideIcon } from "lucide-react";

interface ReasonCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export function ReasonCard({
  icon: Icon,
  title,
  description,
  color,
}: ReasonCardProps) {
  return (
    <div
      className={`flex flex-col items-center space-y-2 border border-${color}-200 dark:border-${color}-800 p-6 rounded-lg bg-white dark:bg-gray-900`}
    >
      <Icon className={`h-8 w-8 text-${color}-500`} />
      <h3
        className={`text-xl font-semibold text-${color}-600 dark:text-${color}-400`}
      >
        {title}
      </h3>
      <p className="text-center text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  );
}

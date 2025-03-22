import { type LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
}: FeatureCardProps) {
  return (
    <div
      className={`flex flex-col items-center space-y-3 text-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg`}
    >
      <Icon className={`h-12 w-12 ${color}`} />
      <h3 className={`text-xl font-bold ${color}`}>{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}

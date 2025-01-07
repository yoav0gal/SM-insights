import { Skeleton } from "@/app/components/skeleton";
import { getKeyTakeaways } from "./key-takeaways-actions";

export type KeyTakeaways = {
  summary: string;
  takeaways: string[];
};

interface KeyTakeawaysProps {
  videoId: string;
}

export async function KeyTakeaways(props: KeyTakeawaysProps) {
  const { summary, takeaways } = await getKeyTakeaways(props.videoId);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
        Key Takeaways
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{summary}</p>
      <ul className="list-disc pl-5 space-y-2">
        {takeaways.map((takeaway, index) => (
          <li key={index} className="text-gray-600 dark:text-gray-400">
            {takeaway}
          </li>
        ))}
      </ul>
    </div>
  );
}

KeyTakeaways.Skeletone = function SectionSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-24 w-5/6" />
    </div>
  );
};

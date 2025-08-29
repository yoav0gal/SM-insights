"use client";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  onClick: () => void;
};

export const ViewIndividualsButton = ({ onClick }: Props) => {
  return (
    <Button onClick={onClick} className="bg-purple-600 hover:bg-purple-700 text-white">
      <Eye size={16} className="mr-2" />
      View Comments
    </Button>
  );
};
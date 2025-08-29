"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const COLORS = [
  "#FF4560",
  "#008FFB",
  "#00E396",
  "#FEB019",
  "#775DD0",
  "#FF9800",
  "#4CAF50",
  "#2196F3",
  "#F44336",
  "#9C27B0",
];

interface CommentsTableModalProps {
  open: boolean;
  onClose: () => void;
  comments: { comment: string; cluster: string; clusterIdx: number }[];
  clusterName: string;
}

export function CommentsTableModal({ open, onClose, comments, clusterName }: CommentsTableModalProps) {
  
  const getClusterColor = (clusterIdx: number) => {
    const color = COLORS[clusterIdx % COLORS.length];
    return `${color}15`; // 15 in hex = ~9% opacity
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-3/4 flex flex-col bg-white border-purple-200">
        <DialogHeader>
          <DialogTitle className="text-purple-800">{clusterName} - Comments </DialogTitle>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-purple-100">
                <TableHead className="text-purple-800 font-semibold">Comment</TableHead>
                <TableHead className="text-purple-800 font-semibold">Cluster</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comments.map((c, index) => (
                <TableRow 
                  key={index} 
                  style={{ backgroundColor: getClusterColor(c.clusterIdx) }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <TableCell className="text-slate-600">{c.comment}</TableCell>
                  <TableCell className="text-slate-600 font-medium">{c.cluster}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
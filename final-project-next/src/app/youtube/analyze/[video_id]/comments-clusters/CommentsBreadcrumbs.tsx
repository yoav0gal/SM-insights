"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import React from "react";

type Props = {
  path: string[];
  onNavigate: (level: number) => void;
};

export const CommentsBreadcrumbs = ({ path, onNavigate }: Props) => {
  return (
    <Breadcrumb>
      <BreadcrumbList key="list">
        <BreadcrumbItem key="root">
          <BreadcrumbLink
            href="#"
            key="root"
            onClick={(e) => {
              e.preventDefault();
              onNavigate(0);
            }}
            className="flex items-center gap-1 text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
          >
            <Home size={16} />
            All 
          </BreadcrumbLink>
        </BreadcrumbItem>
        {path.map((segment, index) => (
          <React.Fragment key={`segment-${index}`}>
            <BreadcrumbSeparator key={index+1} />
            <BreadcrumbItem key={segment}>
              {index === path.length - 1 ? (
                <BreadcrumbPage className="font-semibold text-slate-900 dark:text-slate-50">
                  {segment}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink
                  href="#"
                  key={segment}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate(index + 1);
                  }}
                  className="text-slate-600 hover:text-purple-600 dark:text-slate-400 dark:hover:text-purple-400"
                >
                  {segment}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

import React from "react";
import "./skeleton.css";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return <div className={`skeleton-loader ${className}`} style={style} />;
}

"use client";

import { Badge } from "../ui/badge";
import type { ReactNode } from "react";
import type { FC } from "react";

interface HeroProps {
  badge?: string;
  title: string | ReactNode;
  subtitle?: string | ReactNode;
  className?: string;
  containerClassName?: string;
}

const Hero: FC<HeroProps> = ({
  badge,
  title,
  subtitle,
  className = "",
  containerClassName = "py-8 px-6 sm:px-8 lg:px-12",
}) => {
  return (
    <section className={`relative overflow-hidden bg-white border-b border-slate-200 ${className}`}>
      <div className="absolute inset-0 bg-linear-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50" />

      <div className={`relative ${containerClassName}`}>
        <div className="max-w-4xl">
          {badge && (
            <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 font-medium">
              {badge}
            </Badge>
          )}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-4 text-slate-600 text-base sm:text-lg md:text-xl max-w-3xl">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;

import React from "react";

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  badgeText,
  onClick,
}) => {
  const accentColors = {
    blue: {
      icon: "text-blue-500 bg-blue-50 border border-blue-100/80",
      badge: "text-blue-700 bg-blue-50 border border-blue-100/60",
    },
    emerald: {
      icon: "text-emerald-600 bg-emerald-50 border border-emerald-100/80",
      badge: "text-emerald-700 bg-emerald-50 border border-emerald-100/60",
    },
    amber: {
      icon: "text-amber-600 bg-amber-50 border border-amber-100/80",
      badge: "text-amber-700 bg-amber-50 border border-amber-100/60",
    },
    indigo: {
      icon: "text-indigo-600 bg-indigo-50 border border-indigo-100/80",
      badge: "text-indigo-700 bg-indigo-50 border border-indigo-100/60",
    },
    rose: {
      icon: "text-rose-600 bg-rose-50 border border-rose-100/80",
      badge: "text-rose-700 bg-rose-50 border border-rose-100/60",
    },
    purple: {
      icon: "text-purple-600 bg-purple-50 border border-purple-100/80",
      badge: "text-purple-700 bg-purple-50 border border-purple-100/60",
    },
  };

  const selectedColor = accentColors[color] || accentColors.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200 p-5 flex flex-col justify-between ${
        onClick ? "cursor-pointer group" : ""
      }`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider truncate">
            {title}
          </p>
          {Icon && (
            <div
              className={`p-2.5 rounded-xl shrink-0 transition-transform duration-200 ${selectedColor.icon} ${
                onClick ? "group-hover:scale-105" : ""
              }`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
        <div className="my-1">
          <h3 className="text-xl sm:text-[28px] font-bold text-slate-900 tracking-tight leading-none">
            {value !== undefined && value !== null ? value : 0}
          </h3>
        </div>
      </div>

      {(subtitle || badgeText || trend) && (
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
          {subtitle && (
            <span className="text-slate-500 font-medium truncate text-[11px] sm:text-xs">
              {subtitle}
            </span>
          )}
          {badgeText && (
            <span
              className={`font-semibold px-2 py-0.5 rounded-full text-[11px] shrink-0 ${selectedColor.badge}`}
            >
              {badgeText}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

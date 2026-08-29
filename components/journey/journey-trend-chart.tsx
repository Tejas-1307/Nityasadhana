"use client";

import * as React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export interface TrendDataPoint {
  label: string;
  date: string;
  value?: number; // undefined = missing
  formattedValue?: string;
}

export interface JourneyTrendChartProps {
  title: string;
  subtitle?: string;
  data: TrendDataPoint[];
  colorTheme?: "krishna" | "saffron" | "forest" | "neutral";
  chartType?: "bar" | "line";
  yAxisFormatter?: (val: number) => string;
  emptyLabel?: string;
  className?: string;
}

export function JourneyTrendChart({
  title,
  subtitle,
  data,
  colorTheme = "krishna",
  chartType = "bar",
  yAxisFormatter = (v) => `${v}`,
  emptyLabel = "No reports recorded",
  className,
}: JourneyTrendChartProps) {
  const [selectedPoint, setSelectedPoint] = React.useState<TrendDataPoint | null>(null);
  const [showDataTable, setShowDataTable] = React.useState<boolean>(false);

  const validValues = data.map((d) => d.value).filter((v): v is number => v !== undefined);
  const hasData = validValues.length > 0;

  const maxVal = hasData ? Math.max(...validValues, 1) : 1;
  const minVal = hasData ? Math.min(...validValues, 0) : 0;
  const range = maxVal - minVal || 1;

  const chartHeight = 140;
  const chartWidth = 320;
  const paddingX = 16;
  const paddingY = 16;

  const getThemeColor = () => {
    switch (colorTheme) {
      case "saffron":
        return { stroke: "#A9824D", fill: "#A9824D", bg: "bg-[#A9824D]/10" };
      case "forest":
        return { stroke: "#328A7A", fill: "#328A7A", bg: "bg-[#328A7A]/10" };
      case "neutral":
        return { stroke: "#547070", fill: "#547070", bg: "bg-[#547070]/10" };
      case "krishna":
      default:
        return { stroke: "#3F9495", fill: "#3F9495", bg: "bg-[#3F9495]/10" };
    }
  };

  const colors = getThemeColor();

  return (
    <div
      className={`rounded-3xl border border-[rgba(63,148,149,0.16)] bg-white p-5 shadow-level1 sm:p-6 ${
        className || ""
      }`}
    >
      {/* Chart Header */}
      <div className="flex items-start justify-between gap-2 border-b border-[rgba(63,148,149,0.12)] pb-3">
        <div>
          <h4 className="text-[14px] font-bold text-[#193B3B]">{title}</h4>
          {subtitle && <p className="text-[11px] text-[#547070]">{subtitle}</p>}
        </div>

        {/* Selected Data Point Tooltip Pill */}
        {selectedPoint ? (
          <div className="rounded-xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF] px-2.5 py-1 text-right text-[11px]">
            <span className="font-bold text-[#193B3B]">
              {selectedPoint.formattedValue || (selectedPoint.value !== undefined ? selectedPoint.value : "Missing")}
            </span>
            <span className="text-[#547070]"> · {selectedPoint.date}</span>
          </div>
        ) : (
          <span className="text-[11px] text-[#547070]">Tap bar to view</span>
        )}
      </div>

      {/* SVG Chart Area */}
      <div className="mt-4">
        {!hasData ? (
          <div className="flex h-36 items-center justify-center rounded-2xl bg-[#F7F5EF]/60 text-[12px] text-[#547070]">
            {emptyLabel}
          </div>
        ) : (
          <div className="relative w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="w-full overflow-visible touch-manipulation"
              style={{ maxHeight: "180px" }}
              aria-label={`${title} trend chart`}
            >
              {/* Baseline Grid Line */}
              <line
                x1={paddingX}
                y1={chartHeight - paddingY}
                x2={chartWidth - paddingX}
                y2={chartHeight - paddingY}
                stroke="rgba(63,148,149,0.18)"
                strokeDasharray="2 2"
              />

              {/* Bar Chart Rendering */}
              {chartType === "bar" && (
                <>
                  {data.map((point, idx) => {
                    const usableWidth = chartWidth - paddingX * 2;
                    const step = usableWidth / data.length;
                    const barWidth = Math.max(4, step * 0.65);
                    const x = paddingX + idx * step + (step - barWidth) / 2;

                    if (point.value === undefined) {
                      // Render missing indicator (small dash on baseline)
                      return (
                        <g
                          key={point.date}
                          onClick={() => setSelectedPoint(point)}
                          className="cursor-pointer"
                        >
                          <circle
                            cx={x + barWidth / 2}
                            cy={chartHeight - paddingY}
                            r={2}
                            fill="rgba(63,148,149,0.25)"
                          />
                        </g>
                      );
                    }

                    const usableHeight = chartHeight - paddingY * 2;
                    const barHeight = Math.max(
                      3,
                      ((point.value - minVal) / range) * usableHeight
                    );
                    const y = chartHeight - paddingY - barHeight;
                    const isSelected = selectedPoint?.date === point.date;

                    return (
                      <g
                        key={point.date}
                        onClick={() => setSelectedPoint(point)}
                        className="cursor-pointer transition-opacity hover:opacity-80"
                      >
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={barHeight}
                          rx={3}
                          fill={colors.fill}
                          opacity={isSelected ? 1 : 0.85}
                          className="transition-all"
                        />
                      </g>
                    );
                  })}
                </>
              )}

              {/* Line Chart Rendering */}
              {chartType === "line" && (
                <>
                  {/* Connect valid points with line */}
                  <path
                    d={(() => {
                      const points: string[] = [];
                      const usableWidth = chartWidth - paddingX * 2;
                      const step = usableWidth / Math.max(1, data.length - 1);
                      const usableHeight = chartHeight - paddingY * 2;

                      data.forEach((point, idx) => {
                        if (point.value !== undefined) {
                          const x = paddingX + idx * step;
                          const y =
                            chartHeight -
                            paddingY -
                            ((point.value - minVal) / range) * usableHeight;
                          points.push(`${idx === 0 ? "M" : "L"} ${x} ${y}`);
                        }
                      });
                      return points.join(" ");
                    })()}
                    fill="none"
                    stroke={colors.stroke}
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Line points */}
                  {data.map((point, idx) => {
                    const usableWidth = chartWidth - paddingX * 2;
                    const step = usableWidth / Math.max(1, data.length - 1);
                    const usableHeight = chartHeight - paddingY * 2;
                    const x = paddingX + idx * step;

                    if (point.value === undefined) {
                      return (
                        <circle
                          key={point.date}
                          cx={x}
                          cy={chartHeight - paddingY}
                          r={2}
                          fill="rgba(63,148,149,0.25)"
                          onClick={() => setSelectedPoint(point)}
                          className="cursor-pointer"
                        />
                      );
                    }

                    const y =
                      chartHeight -
                      paddingY -
                      ((point.value - minVal) / range) * usableHeight;
                    const isSelected = selectedPoint?.date === point.date;

                    return (
                      <circle
                        key={point.date}
                        cx={x}
                        cy={y}
                        r={isSelected ? 5 : 3.5}
                        fill={colors.fill}
                        stroke="#ffffff"
                        strokeWidth={1.5}
                        onClick={() => setSelectedPoint(point)}
                        className="cursor-pointer transition-all"
                      />
                    );
                  })}
                </>
              )}
            </svg>

            {/* X-Axis Date Labels */}
            <div className="mt-1 flex justify-between px-2 text-[10px] text-[#547070]">
              <span>{data[0]?.label}</span>
              {data.length > 2 && (
                <span>{data[Math.floor(data.length / 2)]?.label}</span>
              )}
              <span>{data[data.length - 1]?.label}</span>
            </div>
          </div>
        )}
      </div>

      {/* Accessible Collapsible Data Table */}
      <div className="mt-3 border-t border-[rgba(63,148,149,0.12)] pt-2">
        <button
          type="button"
          onClick={() => setShowDataTable((prev) => !prev)}
          className="flex items-center gap-1 text-[11px] font-semibold text-[#547070] hover:text-[#193B3B]"
        >
          <span>{showDataTable ? "Hide detailed log" : "View detailed log"}</span>
          {showDataTable ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {showDataTable && (
          <div className="mt-2 max-h-36 overflow-y-auto rounded-xl border border-[rgba(63,148,149,0.16)] bg-[#F7F5EF]/60 p-2 text-[11px]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[rgba(63,148,149,0.12)] text-[#547070]">
                  <th className="pb-1 font-semibold">Date</th>
                  <th className="pb-1 text-right font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(63,148,149,0.08)]">
                {data.map((d) => (
                  <tr key={d.date} className="py-1">
                    <td className="py-1 text-[#193B3B]">{d.date}</td>
                    <td className="py-1 text-right font-bold text-[#193B3B]">
                      {d.formattedValue ||
                        (d.value !== undefined ? yAxisFormatter(d.value) : "Missing")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

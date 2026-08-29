import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShishyaOverviewItem } from "@/lib/guru/service";
import { AttentionBadge } from "@/components/guru/attention/attention-badge";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";

export interface AttentionSectionProps {
  shishyas: ShishyaOverviewItem[];
}

export function AttentionSection({ shishyas }: AttentionSectionProps) {
  if (shishyas.length === 0) {
    return (
      <div className="rounded-2xl border border-[rgba(63,148,149,0.16)] bg-white p-5 text-center shadow-level1 sm:p-6">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#328A7A]/10 text-[#328A7A]">
          <CheckCircle2 className="h-5 w-5" />
        </div>
        <h3 className="mt-2.5 text-[15px] font-bold text-[#193B3B]">
          All Shishyas Steady Today
        </h3>
        <p className="mt-1 text-[13px] text-[#547070]">
          All active students are following their personal reporting patterns.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#3F9495]/10 text-[#3F9495]">
            <AlertCircle className="h-3.5 w-3.5" />
          </div>
          <h2 className="text-[16px] font-bold text-[#193B3B]">
            Attention Suggested ({shishyas.length})
          </h2>
        </div>
        <span className="text-[12px] text-[#547070]">Observations vs personal baseline</span>
      </div>

      <div className="space-y-2.5">
        {shishyas.map((item) => {
          const primarySignal = item.primarySignal || item.signals[0];
          const initials = item.shishya.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase();

          const focusParam =
            primarySignal?.type === "JAPA_CHANGE"
              ? "?focus=japa"
              : primarySignal?.type === "WAKE_TIME_CHANGE"
                ? "?focus=wakeup"
                : primarySignal?.type === "ACTIVITY_REDUCTION"
                  ? "?focus=reading"
                  : "";

          return (
            <Card
              key={item.shishya.id}
              className="border-[rgba(63,148,149,0.16)] bg-white p-4 shadow-level1 transition-all hover:border-[#3F9495]/40 sm:p-5"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                {/* Student Info & Primary Signal */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF7F4] font-serif text-[14px] font-bold text-[#193B3B]">
                    {initials}
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[15px] font-bold text-[#193B3B]">
                        {item.shishya.spiritualName || item.shishya.name}
                      </span>
                      {item.shishya.spiritualName &&
                        item.shishya.name !== item.shishya.spiritualName && (
                          <span className="text-[12px] text-[#547070]">({item.shishya.name})</span>
                        )}
                      <AttentionBadge level={item.attentionLevel} size="sm" />
                    </div>

                    {primarySignal && (
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
                          <span className="font-semibold text-[#193B3B]">
                            {primarySignal.title}
                          </span>
                          {primarySignal.metric && (
                            <span className="font-medium text-[#547070]">
                              · {primarySignal.metric}
                            </span>
                          )}
                        </div>

                        {/* Transparent Explanation ("Why am I seeing this?") */}
                        <p className="text-[12px] text-[#547070]">{primarySignal.reason}</p>

                        {/* Secondary signal rollup counter */}
                        {item.additionalSignalsCount > 0 && (
                          <p className="text-[11px] font-medium text-[#A9824D]">
                            + {item.additionalSignalsCount} additional{" "}
                            {item.additionalSignalsCount === 1 ? "change" : "changes"} detected
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct Action Button */}
                <div className="flex items-center justify-end self-end sm:self-center">
                  <Link href={`/guru/shishyas/${item.shishya.id}${focusParam}`}>
                    <Button
                      variant="secondary"
                      size="sm"
                      rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
                      className="text-[12px] font-semibold"
                    >
                      Inspect
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

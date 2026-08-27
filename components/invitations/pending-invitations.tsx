"use client";

import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DbInvitation } from "@/lib/db/schema";
import { revokeInvitationAction } from "@/lib/actions/invitations";
import { Clock, CheckCircle2, XCircle, AlertTriangle, Trash2, KeyRound } from "lucide-react";

export function PendingInvitationsList({
  invitations,
  onRefresh,
}: {
  invitations: DbInvitation[];
  onRefresh?: () => void;
}) {
  const [revokingId, setRevokingId] = React.useState<string | null>(null);
  const [confirmRevokeId, setConfirmRevokeId] = React.useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      const res = await revokeInvitationAction(id);
      if (res.success && onRefresh) {
        onRefresh();
      }
    } finally {
      setRevokingId(null);
      setConfirmRevokeId(null);
    }
  };

  if (invitations.length === 0) {
    return null;
  }

  const getStatusBadge = (status: DbInvitation["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="saffron" size="sm">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Pending
            </span>
          </Badge>
        );
      case "used":
        return (
          <Badge variant="feather" size="sm">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Accepted
            </span>
          </Badge>
        );
      case "expired":
        return (
          <Badge variant="neutral" size="sm">
            <span className="flex items-center gap-1 text-[#66635D]">
              <AlertTriangle className="h-3 w-3" />
              Expired
            </span>
          </Badge>
        );
      case "revoked":
        return (
          <Badge variant="neutral" size="sm">
            <span className="flex items-center gap-1 text-[#B33927]">
              <XCircle className="h-3 w-3" />
              Revoked
            </span>
          </Badge>
        );
    }
  };

  const formatExpiry = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - new Date().getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 1) return `Expires in ${days} days`;
    if (days === 1) return `Expires tomorrow`;
    if (days === 0) return `Expires today`;
    return `Expired`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-[#20201D]">
          Generated Invitations ({invitations.length})
        </h3>
      </div>

      <div className="space-y-2.5">
        {invitations.map((inv) => {
          const isPending = inv.status === "pending";

          return (
            <Card
              key={inv.id}
              className="flex flex-col items-start justify-between gap-3 border-[rgba(32,32,29,0.08)] bg-white p-3.5 sm:flex-row sm:items-center sm:p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F7F1E5] text-[#D9822B]">
                  <KeyRound className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] font-bold tracking-wider text-[#20201D]">
                      {inv.rawCodeMasked}
                    </span>
                    {getStatusBadge(inv.status)}
                  </div>
                  <div className="mt-0.5 text-[12px] text-[#66635D]">
                    {isPending
                      ? formatExpiry(inv.expiresAt)
                      : `Created on ${new Date(inv.createdAt).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}`}
                  </div>
                </div>
              </div>

              {/* Actions for Pending Invitations */}
              {isPending && (
                <div className="flex items-center gap-2 self-end sm:self-center">
                  {confirmRevokeId === inv.id ? (
                    <div className="animate-in fade-in flex items-center gap-1.5">
                      <span className="mr-1 text-[12px] font-medium text-[#B33927]">Revoke?</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevoke(inv.id)}
                        isLoading={revokingId === inv.id}
                      >
                        Confirm
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmRevokeId(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setConfirmRevokeId(inv.id)}
                      className="text-[#66635D] hover:bg-[#B33927]/10 hover:text-[#B33927]"
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

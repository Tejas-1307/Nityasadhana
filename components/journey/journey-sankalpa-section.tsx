"use client";

import * as React from "react";
import { DbWeeklySankalpa, DbWeeklyReflection } from "@/lib/db/schema";
import { ActiveSankalpaCard } from "@/components/sankalpa/active-sankalpa-card";
import { CreateSankalpaModal } from "@/components/sankalpa/create-sankalpa-modal";
import { SankalpaReflectionModal } from "@/components/sankalpa/sankalpa-reflection-modal";
import { SankalpaHistoryList } from "@/components/sankalpa/sankalpa-history-list";
import { WeeklyReflectionForm } from "@/components/reflection/weekly-reflection-form";
import { WeeklyReflectionCard } from "@/components/reflection/weekly-reflection-card";
import { ReflectionHistoryList } from "@/components/reflection/reflection-history-list";

export interface JourneySankalpaSectionProps {
  initialActiveSankalpa: DbWeeklySankalpa | null;
  initialHistory: DbWeeklySankalpa[];
  totalHistory: number;
  initialCurrentReflection?: DbWeeklyReflection | null;
  initialReflectionHistory?: DbWeeklyReflection[];
  totalReflectionHistory?: number;
}

export function JourneySankalpaSection({
  initialActiveSankalpa,
  initialHistory,
  totalHistory,
  initialCurrentReflection = null,
  initialReflectionHistory = [],
  totalReflectionHistory = 0,
}: JourneySankalpaSectionProps) {
  const [activeSankalpa, setActiveSankalpa] = React.useState<DbWeeklySankalpa | null>(
    initialActiveSankalpa
  );
  const [history, setHistory] = React.useState<DbWeeklySankalpa[]>(initialHistory);
  const [currentReflection, setCurrentReflection] = React.useState<DbWeeklyReflection | null>(
    initialCurrentReflection
  );
  const [reflectionHistory, setReflectionHistory] = React.useState<DbWeeklyReflection[]>(
    initialReflectionHistory
  );

  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [reflectingSankalpa, setReflectingSankalpa] = React.useState<DbWeeklySankalpa | null>(null);
  const [isEditingReflection, setIsEditingReflection] = React.useState(false);

  const handleCreateSuccess = (newSankalpa: DbWeeklySankalpa) => {
    setActiveSankalpa(newSankalpa);
  };

  const handleReflectionSuccess = (completedSankalpa: DbWeeklySankalpa) => {
    setActiveSankalpa(null);
    setHistory([completedSankalpa, ...history]);
  };

  const handleWeeklyReflectionSaved = (saved: DbWeeklyReflection) => {
    setCurrentReflection(saved);
    setIsEditingReflection(false);
    // Update reflection history if not already in list
    const existingIndex = reflectionHistory.findIndex((r) => r.id === saved.id);
    if (existingIndex >= 0) {
      const updated = [...reflectionHistory];
      updated[existingIndex] = saved;
      setReflectionHistory(updated);
    } else {
      setReflectionHistory([saved, ...reflectionHistory]);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Active Weekly Sankalpa Card */}
      <ActiveSankalpaCard
        sankalpa={activeSankalpa}
        onCreateClick={() => setIsCreateModalOpen(true)}
        onReflectClick={(s) => {
          setReflectingSankalpa(s);
          setIsEditingReflection(true);
        }}
      />

      {/* 2. Weekly Reflection Form or Card */}
      {isEditingReflection || (!currentReflection && reflectingSankalpa) ? (
        <WeeklyReflectionForm
          sankalpa={activeSankalpa || reflectingSankalpa}
          existingReflection={currentReflection}
          onSuccess={handleWeeklyReflectionSaved}
          onCancel={() => setIsEditingReflection(false)}
        />
      ) : currentReflection ? (
        <WeeklyReflectionCard
          reflection={currentReflection}
          sankalpa={activeSankalpa}
          onEditClick={() => setIsEditingReflection(true)}
        />
      ) : null}

      {/* 3. Past Sankalpa Growth Journal */}
      <SankalpaHistoryList
        sankalpas={history}
        total={totalHistory}
      />

      {/* 4. Past Weekly Reflection Archives */}
      <ReflectionHistoryList
        reflections={reflectionHistory}
        total={totalReflectionHistory}
      />

      {/* Creation Modal */}
      <CreateSankalpaModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Sankalpa End-of-Week Reflection Modal */}
      <SankalpaReflectionModal
        sankalpa={reflectingSankalpa}
        isOpen={Boolean(reflectingSankalpa) && !isEditingReflection}
        onClose={() => setReflectingSankalpa(null)}
        onSuccess={handleReflectionSuccess}
      />
    </div>
  );
}

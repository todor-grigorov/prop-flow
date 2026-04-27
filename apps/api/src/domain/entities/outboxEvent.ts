export type OutboxStatus = "PENDING" | "PROCESSING" | "PROCESSED" | "FAILED";

export type OutboxEvent = {
  id: string;
  tenantId: string;
  eventType: string;
  payload: Record<string, unknown>;
  status: OutboxStatus;
  attempts: number;
  createdAt: Date;
  processedAt: Date | null;
};

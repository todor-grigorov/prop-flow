import { OutboxEvent } from "../../domain/entities/outboxEvent.js";

export interface IOutboxRepository {
  create(params: {
    tenantId: string;
    eventType: string;
    payload: Record<string, unknown>;
  }): Promise<OutboxEvent>;

  markProcessed(params: { eventId: string }): Promise<void>;

  markFailed(params: { eventId: string }): Promise<void>;
}

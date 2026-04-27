import { IOutboxRepository } from "../../../application/ports/IOutboxRepository.js";
import { OutboxEvent } from "../../../domain/entities/outboxEvent.js";
import { PrismaClient } from "../../../generated/prisma/client.js";

function toDomainOutboxEvent(row: {
  id: string;
  tenantId: string;
  eventType: string;
  payload: unknown;
  status: OutboxEvent["status"];
  attempts: number;
  createdAt: Date;
  processedAt: Date | null;
}): OutboxEvent {
  return {
    ...row,
    payload: row.payload as Record<string, unknown>,
  };
}

export class OutboxRepository implements IOutboxRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(params: {
    tenantId: string;
    eventType: string;
    payload: Record<string, unknown>;
  }): Promise<OutboxEvent> {
    const row = await this.prisma.outboxEvent.create({
      data: {
        tenantId: params.tenantId,
        eventType: params.eventType,
        payload: JSON.parse(JSON.stringify(params.payload)),
      },
    });

    return toDomainOutboxEvent(row);
  }

  async markProcessed(params: { eventId: string }): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: {
        id: params.eventId,
      },
      data: {
        status: "PROCESSED",
        processedAt: new Date(),
      },
    });
  }

  async markFailed(params: { eventId: string }): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: {
        id: params.eventId,
      },
      data: {
        status: "FAILED",
        attempts: {
          increment: 1,
        },
      },
    });
  }
}

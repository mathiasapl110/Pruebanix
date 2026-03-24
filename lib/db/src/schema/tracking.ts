import { pgTable, serial, integer, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trackingStepsTable = pgTable("tracking_steps", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").notNull(),
  status: text("status").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export const insertTrackingStepSchema = createInsertSchema(trackingStepsTable).omit({ id: true });
export type InsertTrackingStep = z.infer<typeof insertTrackingStepSchema>;
export type TrackingStep = typeof trackingStepsTable.$inferSelect;

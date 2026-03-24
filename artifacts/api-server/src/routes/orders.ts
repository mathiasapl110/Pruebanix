import { Router } from "express";
import { db, ordersTable, productsTable, trackingStepsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";
import { CreateOrderBody, UpdateOrderTrackingBody } from "@workspace/api-zod";

const router = Router();

const TRACKING_STEPS = [
  { status: "pending", title: "Pedido Recibido", description: "Tu pedido ha sido recibido y está siendo procesado." },
  { status: "confirmed", title: "Confirmado", description: "Tu pedido ha sido confirmado por nuestro equipo." },
  { status: "purchased", title: "Comprado en eBay", description: "El equipo ha sido comprado en eBay." },
  { status: "shipped", title: "Enviado", description: "Tu equipo ha sido enviado desde el origen." },
  { status: "in_transit", title: "En Tránsito", description: "Tu equipo está en camino a Perú." },
  { status: "customs", title: "En Aduana", description: "Tu equipo está pasando por aduana en Perú." },
  { status: "delivered", title: "Entregado", description: "¡Tu equipo ha sido entregado! Gracias por tu compra." },
];

async function getOrderWithTracking(orderId: number) {
  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
  if (!order) return null;

  const steps = await db.select().from(trackingStepsTable)
    .where(eq(trackingStepsTable.orderId, orderId))
    .orderBy(trackingStepsTable.id);

  return {
    ...order,
    totalPrice: Number(order.totalPrice),
    trackingSteps: steps,
  };
}

router.post("/", requireAuth, async (req: AuthRequest, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  const { productId, firstName, lastName, dni, phone, ebayTracking, comments, quantity = 1 } = parsed.data;
  const userId = req.userId!;

  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId)).limit(1);
  if (!product) {
    res.status(400).json({ error: "Producto no encontrado" });
    return;
  }

  const totalPrice = (Number(product.price) * quantity).toFixed(2);

  const [order] = await db.insert(ordersTable).values({
    userId,
    productId,
    productName: product.name,
    firstName,
    lastName,
    dni,
    phone,
    ebayTracking,
    comments: comments ?? null,
    quantity,
    totalPrice,
    status: "pending",
  }).returning();

  const stepsToInsert = TRACKING_STEPS.map((step, idx) => ({
    orderId: order.id,
    status: step.status,
    title: step.title,
    description: step.description,
    isCompleted: idx === 0,
    completedAt: idx === 0 ? new Date() : null,
  }));

  await db.insert(trackingStepsTable).values(stepsToInsert);

  const result = await getOrderWithTracking(order.id);
  res.status(201).json(result);
});

router.get("/all", requireAdmin, async (_req: AuthRequest, res) => {
  const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
  const withTracking = await Promise.all(orders.map(o => getOrderWithTracking(o.id)));
  res.json(withTracking.filter(Boolean));
});

router.get("/", requireAuth, async (req: AuthRequest, res) => {
  const orders = await db.select().from(ordersTable)
    .where(eq(ordersTable.userId, req.userId!))
    .orderBy(ordersTable.createdAt);

  const withTracking = await Promise.all(orders.map(o => getOrderWithTracking(o.id)));
  res.json(withTracking.filter(Boolean));
});

router.get("/:id", requireAuth, async (req: AuthRequest, res) => {
  const orderId = parseInt(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const result = await getOrderWithTracking(orderId);
  if (!result) {
    res.status(404).json({ error: "Pedido no encontrado" });
    return;
  }

  if (!req.isAdmin && result.userId !== req.userId) {
    res.status(403).json({ error: "Acceso denegado" });
    return;
  }

  res.json(result);
});

router.patch("/:id/tracking", requireAdmin, async (req: AuthRequest, res) => {
  const orderId = parseInt(req.params.id);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "ID inválido" });
    return;
  }

  const parsed = UpdateOrderTrackingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Datos inválidos" });
    return;
  }

  const { status } = parsed.data;

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, orderId)).limit(1);
  if (!order) {
    res.status(404).json({ error: "Pedido no encontrado" });
    return;
  }

  await db.update(ordersTable)
    .set({ status, updatedAt: new Date() })
    .where(eq(ordersTable.id, orderId));

  const statusOrder = ["pending", "confirmed", "purchased", "shipped", "in_transit", "customs", "delivered"];
  const statusIdx = statusOrder.indexOf(status);

  const steps = await db.select().from(trackingStepsTable).where(eq(trackingStepsTable.orderId, orderId));

  for (const step of steps) {
    const stepIdx = statusOrder.indexOf(step.status);
    const shouldBeCompleted = stepIdx <= statusIdx;

    if (shouldBeCompleted && !step.isCompleted) {
      await db.update(trackingStepsTable)
        .set({ isCompleted: true, completedAt: new Date() })
        .where(eq(trackingStepsTable.id, step.id));
    } else if (!shouldBeCompleted && step.isCompleted && stepIdx > 0) {
      await db.update(trackingStepsTable)
        .set({ isCompleted: false, completedAt: null })
        .where(and(eq(trackingStepsTable.id, step.id), eq(trackingStepsTable.orderId, orderId)));
    }
  }

  const result = await getOrderWithTracking(orderId);
  res.json(result);
});

export default router;

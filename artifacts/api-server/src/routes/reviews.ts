import { Router } from "express";
import { db, reviewsTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  const reviews = await db.select().from(reviewsTable).orderBy(reviewsTable.id);
  res.json(reviews);
});

export default router;

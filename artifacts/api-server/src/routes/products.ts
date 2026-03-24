import { Router } from "express";
import { db, productsTable } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  const products = await db.select().from(productsTable).orderBy(productsTable.id);
  res.json(products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    storage: p.storage,
    color: p.color,
    price: Number(p.price),
    imageUrl: p.imageUrl,
    category: p.category,
    features: p.features ?? [],
    inStock: p.inStock,
  })));
});

export default router;

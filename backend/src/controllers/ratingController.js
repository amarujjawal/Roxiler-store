import { query } from "../config/db.js";

export const listStoresForUser = async (req, res) => {
  const { name = "", address = "", sortBy = "name", sortOrder = "asc" } = req.query;

  const allowedSorts = {
    name: "s.name",
    address: "s.address",
    rating: "average_rating",
  };

  const sort = allowedSorts[sortBy] || "s.name";
  const direction = sortOrder?.toLowerCase() === "desc" ? "DESC" : "ASC";

  const result = await query(
    `SELECT s.id,s.name,s.address,
      ROUND(COALESCE(AVG(allr.rating),0),2) AS average_rating,
      myr.rating AS my_rating
     FROM stores s
     LEFT JOIN ratings allr ON allr.store_id=s.id
     LEFT JOIN ratings myr ON myr.store_id=s.id AND myr.user_id=$1
     WHERE s.name ILIKE $2 AND s.address ILIKE $3
     GROUP BY s.id,myr.rating
     ORDER BY ${sort} ${direction}`,
    [req.user.id, `%${name}%`, `%${address}%`]
  );

  res.json({ stores: result.rows });
};

export const upsertRating = async (req, res) => {
  const storeId = Number(req.params.storeId);
  const rating = Number(req.body.rating);

  if (!Number.isInteger(storeId) || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be an integer from 1 to 5" });
  }

  const store = await query("SELECT id FROM stores WHERE id=$1", [storeId]);
  if (!store.rows[0]) return res.status(404).json({ message: "Store not found" });

  const result = await query(
    `INSERT INTO ratings(user_id,store_id,rating)
     VALUES($1,$2,$3)
     ON CONFLICT(user_id,store_id)
     DO UPDATE SET rating=EXCLUDED.rating, updated_at=CURRENT_TIMESTAMP
     RETURNING *`,
    [req.user.id, storeId, rating]
  );

  res.status(200).json({ rating: result.rows[0] });
};

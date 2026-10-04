import { query } from "../config/db.js";

export const ownerDashboard = async (req, res) => {
  const store = await query(
    `SELECT s.id,s.name,s.email,s.address,
      ROUND(COALESCE(AVG(r.rating),0),2) AS average_rating
     FROM stores s
     LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.owner_id=$1
     GROUP BY s.id`,
    [req.user.id]
  );

  if (!store.rows[0]) {
    return res.status(404).json({ message: "No store is assigned to this owner" });
  }

  const raters = await query(
    `SELECT u.id,u.name,u.email,u.address,r.rating,r.updated_at AS "ratedAt"
     FROM ratings r
     JOIN users u ON u.id=r.user_id
     WHERE r.store_id=$1
     ORDER BY r.updated_at DESC`,
    [store.rows[0].id]
  );

  res.json({
    store: store.rows[0],
    raters: raters.rows,
  });
};

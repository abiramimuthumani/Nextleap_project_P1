-- Starting facts. One restaurant, three reviews, spread across days
-- so that "latest" actually means something.

WITH r AS (
  INSERT INTO restaurants (name, cuisine, area)
  VALUES ('Ludhiana Burrito', 'Indian', 'Sector 32')
  RETURNING id
)
INSERT INTO reviews (restaurant_id, rating, comment, created_at)
SELECT r.id, v.rating, v.comment, NOW() - v.age
FROM r, (VALUES
  (5, 'Paneer burrito is unreal', INTERVAL '8 days'),
  (4, 'Good, but slow service',   INTERVAL '6 days'),
  (4, 'Solid. Would repeat.',     INTERVAL '2 days')
) AS v(rating, comment, age);

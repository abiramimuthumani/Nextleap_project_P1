-- The shape of our two tables.
-- Notice what is NOT here: no average_rating, no latest_review.
-- Those are answers we compute, not facts we store.

CREATE TABLE restaurants (
  id        SERIAL PRIMARY KEY,
  name      TEXT NOT NULL,
  cuisine   TEXT NOT NULL,
  area      TEXT NOT NULL
);

CREATE TABLE reviews (
  id            SERIAL PRIMARY KEY,
  restaurant_id INTEGER NOT NULL REFERENCES restaurants(id),
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

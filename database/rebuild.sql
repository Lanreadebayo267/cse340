-- DROP TABLES IF THEY EXIST (SAFE REBUILD)
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS classification;
DROP TABLE IF EXISTS account;

-- DROP TYPE IF IT EXISTS
DROP TYPE IF EXISTS account_type_enum;

-------------------------------------------------
-- CREATE TYPE
-------------------------------------------------
CREATE TYPE account_type_enum AS ENUM (
  'Client',
  'Admin'
);

-------------------------------------------------
-- CREATE TABLE: account
-------------------------------------------------
CREATE TABLE account (
  account_id SERIAL PRIMARY KEY,
  account_firstname VARCHAR(50) NOT NULL,
  account_lastname VARCHAR(50) NOT NULL,
  account_email VARCHAR(100) UNIQUE NOT NULL,
  account_password VARCHAR(255) NOT NULL,
  account_type account_type_enum DEFAULT 'Client'
);

-------------------------------------------------
-- CREATE TABLE: classification
-------------------------------------------------
CREATE TABLE classification (
  classification_id SERIAL PRIMARY KEY,
  classification_name VARCHAR(50) NOT NULL
);

-------------------------------------------------
-- CREATE TABLE: inventory
-------------------------------------------------
CREATE TABLE inventory (
  inv_id SERIAL PRIMARY KEY,
  inv_make VARCHAR(50) NOT NULL,
  inv_model VARCHAR(50) NOT NULL,
  inv_description TEXT NOT NULL,
  inv_image VARCHAR(255) NOT NULL,
  inv_thumbnail VARCHAR(255) NOT NULL,
  classification_id INT NOT NULL,
  CONSTRAINT fk_classification
    FOREIGN KEY (classification_id)
    REFERENCES classification(classification_id)
);

-------------------------------------------------
-- INSERT DATA INTO classification
-------------------------------------------------
INSERT INTO classification (classification_name)
VALUES
  ('Sport'),
  ('SUV'),
  ('Truck'),
  ('Sedan');

-------------------------------------------------
-- INSERT DATA INTO inventory
-------------------------------------------------
INSERT INTO inventory (
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  classification_id
)
VALUES
  (
    'GM',
    'Hummer',
    'This vehicle has small interiors but great power.',
    '/images/hummer.jpg',
    '/images/hummer-tn.jpg',
    2
  ),
  (
    'Ferrari',
    '488',
    'A fast sport car.',
    '/images/ferrari.jpg',
    '/images/ferrari-tn.jpg',
    1
  ),
  (
    'Porsche',
    '911',
    'A classic sport car.',
    '/images/porsche.jpg',
    '/images/porsche-tn.jpg',
    1
  );

-------------------------------------------------
-- TASK 1 QUERY #4 (REQUIRED AT END)
-- Update GM Hummer description
-------------------------------------------------
UPDATE inventory
SET inv_description = REPLACE(
  inv_description,
  'small interiors',
  'a huge interior'
)
WHERE inv_make = 'GM'
AND inv_model = 'Hummer';

-------------------------------------------------
-- TASK 1 QUERY #6 (REQUIRED AT END)
-- Update image paths
-------------------------------------------------
UPDATE inventory
SET
  inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
  inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

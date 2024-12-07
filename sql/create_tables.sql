CREATE TABLE cartProducts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    carts_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    UNIQUE (carts_id, product_id),
    FOREIGN KEY (carts_id) REFERENCES carts (id),
    FOREIGN KEY (product_id) REFERENCES products (id)
) 

CREATE TABLE "carts" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "users_id" INTEGER UNIQUE,
    "status" TEXT CHECK (status IN ('new', 'abandoned', 'purchased')),
    "created_at" NUMERIC,
    "created_by" INTEGER, 
    FOREIGN KEY (users_id) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id) 
)

CREATE TABLE "categories" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "name" TEXT,
    "created_by" INTEGER,
    FOREIGN KEY (created_by) REFERENCES users(id) 
)

CREATE TABLE "products" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "categories_id" INTEGER NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "price" REAL,
    "url" TEXT,
    "created_by" INTEGER,
    FOREIGN KEY (categories_id) REFERENCES categories(id),
    FOREIGN KEY (created_by) REFERENCES users(id) 
)

CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "created_at" NUMERIC,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "users_types" TEXT CHECK (users_types IN ('admin', 'shopper'))
)
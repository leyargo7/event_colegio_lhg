-- creating the database
CREATE DATABASE eventG;

-- using the database
use eventG;

-- creating a table
CREATE TABLE customer(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL
);

-- MOSTRAR TABLAS
SHOW TABLES;

-- VER DESCRIPCION DE LA TABLA
describe customer;
import mysql from "mysql"

let sqlTableData = [
  "CREATE TABLE users (_id VARCHAR(50) PRIMARY KEY,username VARCHAR(50) NOT NULL,imageUrl VARCHAR(100),dob DATE,gender VARCHAR(11),address VARCHAR(100),city VARCHAR(30),state VARCHAR(30),country VARCHAR(15),about VARCHAR(200),email VARCHAR(30) UNIQUE,phoneNo VARCHAR(15) UNIQUE, password VARCHAR(100))",
  "CREATE TABLE shops (_id VARCHAR(50) PRIMARY KEY,name VARCHAR(50) UNIQUE,imageUrl VARCHAR(100), createdBy VARCHAR(40) UNIQUE, FOREIGN KEY (createdBy) REFERENCES users(_id), createdOn DATE)",
  "CREATE TABLE category (_id VARCHAR(50) PRIMARY KEY,name VARCHAR(50) UNIQUE,shopId VARCHAR(45), createdBy VARCHAR(40), isSystem BOOLEAN, FOREIGN KEY (createdby) REFERENCES users(_id), FOREIGN KEY (shopId) REFERENCES shops(_id))",
  "CREATE TABLE products (_id VARCHAR(50) PRIMARY KEY,name VARCHAR(100),imageUrl VARCHAR(100),categoryId VARCHAR(50),description VARCHAR(100),price FLOAT(10,4),quantity INT, shopId VARCHAR(45),createdBy VARCHAR(40), createdOn DATE,salesCount INT,shopName VARCHAR(20), FOREIGN KEY (createdBy) REFERENCES users(_id), FOREIGN KEY (shopId) REFERENCES shops(_id), FOREIGN KEY (categoryId) REFERENCES category(_id))",
  "CREATE TABLE favorites (_id VARCHAR(50) PRIMARY KEY, createdBy VARCHAR(40),  productId VARCHAR(50),   UNIQUE(productId, createdBy), createdOn DATE,  FOREIGN KEY (createdBy) REFERENCES users(_id), FOREIGN KEY (productId) REFERENCES products(_id))",
  "CREATE TABLE cart (_id VARCHAR(50) PRIMARY KEY, createdBy VARCHAR(40),  productId VARCHAR(50), quantity INT, FOREIGN KEY (createdBy) REFERENCES users(_id), FOREIGN KEY (productId) REFERENCES products(_id))",
  "CREATE TABLE purchases (_id VARCHAR(50) PRIMARY KEY, createdBy VARCHAR(40),createdOn DATE, price FLOAT(10,4), FOREIGN KEY (createdBy) REFERENCES users(_id))",
  "CREATE TABLE orders (_id VARCHAR(50) PRIMARY KEY,createdBy VARCHAR(40),  productId VARCHAR(50),price FLOAT(10,4),quantity INT, createdOn DATETIME, shopId VARCHAR(45), productImage VARCHAR(100), productName VARCHAR(100), purchaseId VARCHAR(50),FOREIGN KEY (createdBy) REFERENCES users(_id), FOREIGN KEY (shopId) REFERENCES shops(_id), FOREIGN KEY (productId) REFERENCES products(_id), FOREIGN KEY (purchaseId) REFERENCES purchases(_id))",
]

var connection = mysql.createPool({
  host: "etsy-database.caphir2hzg3k.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "admin123",
  port: "3306",
  database: "etsydb",
})

connection.getConnection((err) => {
  if (err) {
    console.log("######### error occurred")
    throw "Error occoured" + err
  }
  console.log("Connection Created")

  function createTable(tables) {
    if (tables.length == 0) return
    var tableQuery = tables.pop()
    connection.query(tableQuery, function (err, result) {
      if (err) {
        console.log("######### create table error #########")
        throw err
      }
      console.log("Table created")
      createTable(tables)
    })
  }
  createTable(sqlTableData.reverse())
})

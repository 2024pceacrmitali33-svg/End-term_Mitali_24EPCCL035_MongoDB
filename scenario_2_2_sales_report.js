
const sales = db.getSiblingDB("sales");

sales.orders.drop();

const result = sales.orders.insertMany([
  {
    orderId: 1,
    customer: "Arun",
    category: "Electronics",
    product: "Laptop",
    qty: 1,
    price: 55000
  },
  {
    orderId: 2,
    customer: "Divya",
    category: "Electronics",
    product: "Mouse",
    qty: 2,
    price: 500
  },
  {
    orderId: 3,
    customer: "Arun",
    category: "Stationery",
    product: "Notebook",
    qty: 20,
    price: 10
  },
  {
    orderId: 4,
    customer: "Meena",
    category: "Furniture",
    product: "Chair",
    qty: 2,
    price: 3500
  },
  {
    orderId: 5,
    customer: "Divya",
    category: "Electronics",
    product: "Headphones",
    qty: 1,
    price: 1500
  },
  {
    orderId: 6,
    customer: "Karthik",
    category: "Stationery",
    product: "Pen",
    qty: 10,
    price: 40
  }
]);

print("STEP 1 - INSERT ORDERS");
printjson(result);

print("STEP 2 - ELECTRONICS ORDERS");
sales.orders.aggregate([
  { $match: { category: "Electronics" } },
  { $project: { _id: 0, orderId: 1, product: 1 } }
]).forEach(printjson);

print("STEP 3 - LINE TOTAL");
sales.orders.aggregate([
  {
    $project: {
      _id: 0,
      orderId: 1,
      customer: 1,
      lineTotal: { $multiply: ["$qty", "$price"] }
    }
  }
]).forEach(printjson);

print("STEP 4 - TOTAL QUANTITY BY CATEGORY");
sales.orders.aggregate([
  {
    $group: {
      _id: "$category",
      totalQty: { $sum: "$qty" }
    }
  }
]).forEach(printjson);

print("STEP 5 - REVENUE AND AVERAGE PRICE");
sales.orders.aggregate([
  {
    $group: {
      _id: "$category",
      revenue: {
        $sum: { $multiply: ["$qty", "$price"] }
      },
      avgPrice: { $avg: "$price" }
    }
  },
  { $sort: { revenue: -1 } }
]).forEach(printjson);

print("STEP 6 - TOP TWO CUSTOMERS");
sales.orders.aggregate([
  {
    $group: {
      _id: "$customer",
      spent: {
        $sum: { $multiply: ["$qty", "$price"] }
      }
    }
  },
  { $sort: { spent: -1 } },
  { $limit: 2 }
]).forEach(printjson);

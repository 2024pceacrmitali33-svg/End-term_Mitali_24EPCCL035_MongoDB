 
const library = db.getSiblingDB("library");

library.members.drop();

const result = library.members.insertMany([
  {
    name: "Ravi",
    address: { city: "Chennai", pin: "600001" },
    borrowed: ["Python Basics", "MongoDB Guide"],
    fee: 0
  },
  {
    name: "Kumar",
    address: { city: "Chennai", pin: "600028" },
    borrowed: [],
    fee: 0
  },
  {
    name: "Sita",
    address: { city: "Bangalore", pin: "560001" },
    borrowed: ["MongoDB Guide"],
    fee: 50
  },
  {
    name: "Lakshmi",
    address: { city: "Madurai", pin: "625001" },
    borrowed: ["Python Basics"],
    fee: 120
  }
]);

print("STEP 1 - DATABASE AND COLLECTION");
printjson(result);
print("DATABASES");
printjson(db.adminCommand({ listDatabases: 1 }).databases);
print("COLLECTIONS");
printjson(library.getCollectionNames());

print("STEP 2 - MEMBERS IN CHENNAI");
library.members.find(
  { "address.city": "Chennai" },
  { _id: 0, name: 1, address: 1 }
).forEach(printjson);

print("STEP 3 - MEMBERS WHO BORROWED MONGODB GUIDE");
library.members.find(
  { borrowed: "MongoDB Guide" },
  { _id: 0, name: 1, borrowed: 1 }
).forEach(printjson);

print("STEP 4 - MEMBERS WHO BORROWED BOTH BOOKS");
library.members.find(
  { borrowed: { $all: ["Python Basics", "MongoDB Guide"] } },
  { _id: 0, name: 1 }
).forEach(printjson);

print("STEP 5 - MEMBERS WITH NO BOOKS");
library.members.find(
  { borrowed: { $size: 0 } },
  { _id: 0, name: 1 }
).forEach(printjson);

print("STEP 6 - UPDATE SITA CITY");
printjson(
  library.members.updateOne(
    { name: "Sita" },
    { $set: { "address.city": "Chennai" } }
  )
);

print("STEP 7 - MEMBERS WHO OWE FEES");
print(library.members.countDocuments({ fee: { $gt: 0 } }));

print("DROP COLLECTION");
print(library.members.drop());


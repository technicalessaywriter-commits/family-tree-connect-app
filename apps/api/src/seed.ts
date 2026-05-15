import bcrypt from "bcryptjs";
import { connectDb, disconnectDb } from "./db.js";
import { User } from "./models/User.js";
import { FamilyTree } from "./models/FamilyTree.js";
import { Member } from "./models/Member.js";
import { syncRelationship } from "./services/relationships.js";

await connectDb();
await Promise.all([User.deleteMany({}), FamilyTree.deleteMany({}), Member.deleteMany({})]);

const passwordHash = await bcrypt.hash("password123", 12);
const user = await User.create({ name: "Avery Morgan", email: "avery@example.com", passwordHash });
const tree = await FamilyTree.create({
  name: "Morgan Family",
  description: "Sample family tree with three generations.",
  owner: user.id,
  events: [{ title: "Family Reunion", date: new Date("2026-08-12"), description: "Annual summer gathering." }]
});

const members = await Member.insertMany([
  { tree: tree.id, fullName: "Eleanor Morgan", gender: "female", birthDate: "1944-02-18", biography: "Teacher and community organizer.", generation: 1, position: { x: 120, y: 40 } },
  { tree: tree.id, fullName: "Samuel Morgan", gender: "male", birthDate: "1941-09-04", deathDate: "2019-03-22", biography: "Loved woodworking and oral history.", generation: 1, position: { x: 420, y: 40 } },
  { tree: tree.id, fullName: "Daniel Morgan", gender: "male", birthDate: "1970-05-16", biography: "Architect.", generation: 0, position: { x: 270, y: 260 } },
  { tree: tree.id, fullName: "Avery Morgan", gender: "nonbinary", birthDate: "1998-11-03", biography: "Family archivist.", generation: -1, position: { x: 270, y: 500 } }
]);

await syncRelationship(String(members[0]._id), String(members[1]._id), "spouse");
await syncRelationship(String(members[0]._id), String(members[2]._id), "parent");
await syncRelationship(String(members[2]._id), String(members[3]._id), "parent");

console.log("Seeded avery@example.com / password123");
await disconnectDb();

import db from "./db.js";
import Quote from "./quote.js";

const syncDb = async () => {
  await db.sync({ alter: true, logging: false });
};

export {
  syncDb,
  db,
  Quote
};

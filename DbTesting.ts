import orcaDB from "./Main";
import prompter from "prompt-sync";

const db = orcaDB.init(
  {
    dbName: "Coco",
    username: "DOG",
    password: "Cat",
  },
  () => {
    console.log("DB Invited!");
  }
);

(async () => {
  const username = "Coco";
  const password = "IloveDogs@@!";

  await db.createtable({ tablename: "users" });

  await db.retrieveTable({ db: "Coco", table: "users" });
  const user: Array<any> = db.selectWhere({
    table: "users",
    clause: "username",
    equals: username,
  });
  console.log(db.all());
})();

import fs from "fs";

type OrcaBase = {
  dbName: string;
  username: string;
  password: string;
};

type Table = {
  tablename: string;
};

type Tables = {
  tablename: string;
  data: Array<object>;
};

type Insert = {
  table: string;
  schema: Object;
};

type Select = {
  table: string;
  clause: string;
  equals: any;
};

type DataBase = {
  db: string;
  table: string;
};

function Orca() {
  function orcaBase(this: any) {}

  orcaBase.init = function (database: OrcaBase, callback: Function) {
    const dbtables: Array<Tables> = [];

    const db = () => {};

    db.username = () => {
      return database.username;
    };

    db.password = () => {
      return database.password;
    };

    db.createtable = (data: Table) => {
      return new Promise<void>((resolve, reject) => {
        dbtables.push({ tablename: data.tablename, data: [] });

        if (fs.existsSync(`${database.dbName}/${data.tablename}`)) {
          resolve();
        }

        fs.mkdir(
          `${database.dbName}/${data.tablename}`,
          (err: Error | null) => {
            if (err) reject(err);
            resolve();
          }
        );
      });
    };

    db.insert = (data: Insert) => {
      return new Promise<void>((resolve, reject) => {
        const table = dbtables.findIndex(
          (table) => table.tablename === data.table
        );
        if (table === -1) {
          throw new Error("Table not found!");
        } else {
          dbtables[table].data.push(data.schema);
          fs.writeFile(
            `${database.dbName}/${data.table}/data_${dbtables[table].data.length}`,
            JSON.stringify(dbtables[table].data),
            (err: Error | null) => {
              if (err) reject(err);
              resolve();
            }
          );
        }
      });
    };

    db.all = () => {
      return JSON.stringify(dbtables);
    };

    db.deleteAll = (data: { table: string }) => {
      const table = dbtables.findIndex(
        (table) => table.tablename === data.table
      );
      if (table === -1) {
        throw new Error("Table not found!");
      } else {
        dbtables.splice(table, 1);
      }
    };

    db.deleteWhere = (data: Select) => {
      const table = dbtables.findIndex(
        (table) => table.tablename === data.table
      );
      if (table === -1) {
        throw new Error("Table not found!");
      } else {
        const dbTable = dbtables[table].data;
        const schema = dbTable.findIndex(
          (item: { [key: string]: any }) => item[data.clause] === data.equals
        );
        dbtables[table].data.splice(schema, 1);
      }
    };

    db.selectWhere = (data: Select) => {
      const table = dbtables.findIndex(
        (table) => table.tablename === data.table
      );
      if (table === -1) {
        throw new Error("Table not found!");
      } else {
        const dbTable = dbtables[table].data;
        const schema = dbTable.find(
          (item: { [key: string]: any }) => item[data.clause] === data.equals
        );
        if (!schema) {
          return [];
        }
        return [schema];
      }
    };

    db.retrieveTable = (data: DataBase) => {
      return new Promise<void>((resolve, reject) => {
        const table = dbtables.findIndex(
          (table) => table.tablename === data.table
        );
        if (table === -1) {
          throw new Error("Table not found!");
        }
        fs.readdir(`${data.db}/${data.table}`, (err, files) => {
          if (err) reject(err);
          fs.readFile(
            `${data.db}/${data.table}/data_${files.length}`,
            "utf-8",
            (err: Error | null, data: any | null) => {
              if (err) reject(err);
              JSON.parse(data).forEach((fileData: any) => {
                dbtables[table].data.push(fileData);
              });
              resolve();
            }
          );
        });
      });
    };

    if (fs.existsSync(`${database.dbName}`)) {
      return db;
    }

    fs.mkdir(database.dbName, (err: Error | null) => {
      console.error(err);
    });

    callback();
    return db;
  };
  return orcaBase;
}

const orcaDB = Orca();

export default orcaDB;

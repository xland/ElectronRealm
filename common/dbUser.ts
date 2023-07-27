import { ModelUser } from "./ModelUser";
import db from "./db";
class DBUser{
    tableName = "User"
    insert(user:ModelUser){
        let sql = `INSERT INTO ${this.tableName} (ID,UserName) VALUES (@ID,@UserName)`;
        let insert = db.prepare(sql);
        console.log(db,sql,user);
        insert.run({...user});
        console.log("aaa");
    }
    select(){
        let sql = `SELECT * FROM ${this.tableName};`
        let stmt = db.prepare(sql);
        let result = stmt.all();
        return result;
    }
}
export let dbUser = new DBUser();
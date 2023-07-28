import { ModelUser } from "./ModelUser";
import db from "./db";
import { DBBase } from "./dbBase";
class DBUser extends DBBase{
    insertOne(user:ModelUser){
        let sql = `INSERT INTO ${this.tableName} (ID,UserName) VALUES (@ID,@UserName)`;
        let insert = db.prepare(sql);
        insert.run({...user});
    }
    insertAll(users:ModelUser[]){
        let sql = `INSERT INTO ${this.tableName} (ID,UserName) VALUES (@ID,@UserName)`;
        let insert = db.prepare(sql);
        db.transaction((arr) => {
            for (const obj of arr) insert.run({...obj});
        })(users);
    }
    constructor(){
        super();
        this.tableName = "User"
    }
}
export let dbUser = new DBUser();
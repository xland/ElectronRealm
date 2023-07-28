import { ModelMessage } from "./ModelMessage";
import db from "./db";
import { DBBase } from "./dbBase";
class DBMessage extends DBBase{
    insertOne(user:ModelMessage){
        let sql = `INSERT INTO ${this.tableName} (ID,FromUserId,ToUserId,Content) VALUES (@ID,@FromUserId,@ToUserId,@Content)`;
        let insert = db.prepare(sql);
        insert.run({...user});
    }
    insertAll(msgs:ModelMessage[]){
        let sql = `INSERT INTO ${this.tableName} (ID,FromUserId,ToUserId,Content) VALUES (@ID,@FromUserId,@ToUserId,@Content)`;
        let insert = db.prepare(sql);
        let func = db.transaction((arr) => {
            for (const obj of arr) {
                insert.run({...obj});
            }
        })
        func(msgs);        
    }
    select(query){
        let sql = `SELECT * from ${this.tableName} where ${query}`
        let stmt = db.prepare(sql);
        let result = stmt.all();
        return result;
    }
    constructor(){
        super();
        this.tableName = "Message"
    }
}
export let dbMessage = new DBMessage();
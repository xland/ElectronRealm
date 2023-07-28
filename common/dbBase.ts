import db from "./db";
export class DBBase{    
    tableName:string
    selectAll(){
        let sql = `SELECT * FROM ${this.tableName};`
        let stmt = db.prepare(sql);
        let result = stmt.all();
        return result;
    }
    deleteOne(ID:string){

    }
    deleteAll(IDs:string[]){

    }
    count():number{
        let sql = `SELECT COUNT(*) AS count FROM ${this.tableName}`
        let stmt = db.prepare(sql);
        let result = stmt.get();
        return Number(result.count);
    }
}
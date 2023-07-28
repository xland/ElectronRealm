import db from "./db";
/**
 * 所有数据访问层的基类
 * 一些公用的数据访问方法放在这个类中
 */
export class DBBase{    
    /**
     * 用于存储表名
     * 是在子类中初始化的
     */
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
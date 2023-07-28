import {ipcMain} from "electron";
import Database from "better-sqlite3-multiple-ciphers"
import path from "path";
import fsex from "fs-extra"
import crypto from "crypto"
let db;

/**
 * 使用用户ID做数据库密钥，保证每个用户的密钥都不一样
 * 即使恶意用户知道我们用MD5算法，不知道我们如何加盐，也无法解密我们的数据库
 * @returns 
 */
let getKey = ()=>{
    let userId = "liuxiaolun"
    userId = `***!!!${userId}!!!***`//加盐
    userId = crypto.createHash('md5').update(userId).digest('hex');
    return userId;
}
/**
 * 打开数据库
 * @param dbPath 
 */
let openDb = (dbPath:string)=>{
    db = new Database(dbPath,{
        timeout:8000,
        verbose:(sql)=>{
            // console.log(sql) //打印SQL语句，用于调试
        }
    })
    db.pragma(`key='${getKey()}'`); //不一样
    db.pragma('journal_mode = WAL');
}

/**
 * 创建数据库
 * @param dbPath 
 */
let createDb = (dbPath:string)=>{
    db = new Database(dbPath,{
        timeout:8000,
        verbose:(sql)=>{
            // console.log(sql) //打印SQL语句，用于调试
        }
    })    
    db.pragma(`rekey='${getKey()}'`); //不一样
    db.pragma('journal_mode = WAL');
    
    let sql = `CREATE TABLE User(ID VARCHAR2(38) PRIMARY KEY,UserName VARCHAR2(60));
    CREATE TABLE Message(ID VARCHAR2(38) PRIMARY KEY,Content TEXT,FromUserId VARCHAR2(38),ToUserId VARCHAR2(38),SendTime INT64);
    `
    db.exec(sql);
}
/**
 * 初始化数据库
 */
let init = ()=>{
    let start = performance.now();
    let dbPath = path.join(process.env["APPDATA"] as string,"Electron","db");
    if(ipcMain){
        let exist = fsex.pathExistsSync(dbPath);
        if(!exist){
            fsex.mkdirSync(dbPath);
            dbPath = path.join(dbPath,"db.db");
            createDb(dbPath);
        }else{
            dbPath = path.join(dbPath,"db.db");
            exist = fsex.pathExistsSync(dbPath);
            if(!exist){
                createDb(dbPath);
            }else{
                openDb(dbPath);
            }                
        }
    }else{
        dbPath = path.join(dbPath,"db.db");
        openDb(dbPath);
    }   
    console.log("db init",performance.now()-start);    
}
init();
export default db;
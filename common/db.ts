import {ipcMain} from "electron";
import Database from "better-sqlite3-multiple-ciphers"
import path from "path";
import fsex from "fs-extra"
import crypto from "crypto"
let db;
let getKey = ()=>{
    let userId = "liuxiaolun"
    userId = `***!!!${userId}!!!***`//加盐
    userId = crypto.createHash('md5').update(userId).digest('hex');
    return userId;
}
let openDb = (dbPath:string)=>{
    db = new Database(dbPath,{
        timeout:8000,
        verbose:(sql)=>{
            // console.log(sql)
        }
    })
    db.pragma(`key='${getKey()}'`);
    db.pragma('journal_mode = WAL');
}
let createDb = (dbPath:string)=>{
    db = new Database(dbPath,{
        timeout:8000,
        verbose:(sql)=>{
            // console.log(sql)
        }
    })    
    db.pragma(`rekey='${getKey()}'`);
    db.pragma('journal_mode = WAL');
    let sql = `CREATE TABLE User(ID VARCHAR2(38) PRIMARY KEY,UserName VARCHAR2(60));
    CREATE TABLE Message(ID VARCHAR2(38) PRIMARY KEY,Content TEXT,FromUserId VARCHAR2(38),ToUserId VARCHAR2(38),SendTime INT64);
    `
    db.exec(sql);
}
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
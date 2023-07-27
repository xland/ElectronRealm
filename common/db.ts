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
    console.log(userId);
    return userId;
}

let openDb = (dbPath:string)=>{
    db = new Database(dbPath,{timeout:8000})
    db.pragma(`key='${getKey()}'`);
    db.pragma('journal_mode = WAL');
}
let createDb = (dbPath:string)=>{
    db = new Database(dbPath,{timeout:8000})    
    db.pragma(`rekey='${getKey()}'`);
    db.pragma('journal_mode = WAL');
    let sql = `CREATE TABLE User(ID VARCHAR2(38),UserName VARCHAR2(60));`
    db.exec(sql);
}
let init = ()=>{
    let dbPath = path.join(process.env["APPDATA"] as string,"Electron","db");
    console.log(111);
    if(ipcMain){
        let exist = fsex.pathExistsSync(dbPath);
        if(!exist){
            console.log(222);
            fsex.mkdirSync(dbPath);
            dbPath = path.join(dbPath,"db.db");
            createDb(dbPath);
        }else{
            console.log(333);
            dbPath = path.join(dbPath,"db.db");
            exist = fsex.pathExistsSync(dbPath);
            if(!exist){
                console.log(444);
                createDb(dbPath);
            }else{
                console.log(555);
                openDb(dbPath);
            }                
        }
    }else{
        dbPath = path.join(dbPath,"db.db");
        openDb(dbPath);
    }   
    
}
init();
export default db;
import {app, BrowserWindow,ipcMain} from "electron";
import path from "path";
import fsex from "fs-extra"
import crypto from "crypto"
import { ModelUser } from "../common/ModelUser";
import { dbUser } from "../common/dbUser";
import { dbMessage } from "../common/dbMessage";
import { ModelMessage } from "../common/ModelMessage";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let wins:BrowserWindow[] = [];
let users:ModelUser[];
let creatreWindow = async ()=>{
    let win = new BrowserWindow(
        {
            webPreferences:{
                allowRunningInsecureContent: true,
                contextIsolation: false,
                nodeIntegration:true,
                sandbox:false,
                webSecurity:false,
            }
        }
    );
    wins.push(win);
    await win.loadFile(path.join(__dirname,"index.html"));
    win.show();
    win.webContents.openDevTools({mode:"undocked"});
}


let initUser = async ()=>{   
    let count = dbUser.count();
    if(count <= 2){
        let start = performance.now();
        let user1 = new ModelUser();
        user1.UserName = "李清照"
        let user2 = new ModelUser();
        user2.UserName = "辛弃疾"
        dbUser.insertAll([user1,user2]);
        console.log("insert two obj time",performance.now()-start)
    }    
    let start = performance.now();
    users = dbUser.selectAll() as ModelUser[]
    console.log(users);
    console.log("select two obj time",performance.now()-start)
}

let initMessage = async ()=>{
    let count = dbMessage.count();
    let dataCount = 300000;
    if(count >= dataCount) {
        console.log("未插入数据，数据已存在：",count);
        return;
    };
    let start = performance.now();
    let rows:ModelMessage[] = [];
    for(let i=0;i<dataCount;i++){
        let fromIndex = i%2;
        let toIndex = fromIndex==1?0:1;
        let obj = new ModelMessage();
        obj.FromUserId = users[fromIndex].ID;
        obj.ToUserId = users[toIndex].ID;
        obj.SendTime = Date.now();
        if(i == dataCount/2 ){
            obj.Content = `这是${users[fromIndex]["userName"]}发送给${users[toIndex]["userName"]}的第${i}条消息，
        天接云涛连晓雾，星河欲转千帆舞。仿佛梦魂归帝所。闻天语，殷勤问我归何处！我报路长嗟日暮，学诗谩有惊人句。九万里风鹏正举。风休住，蓬舟吹取三山去！`;
        }else{
            obj.Content = `这是${users[fromIndex]["userName"]}发送给${users[toIndex]["userName"]}的第${i}条消息，这条消息并不重要！`;
        }
        rows.push(obj);
    }
    dbMessage.insertAll(rows);
    console.log(`单表插入${dataCount}数据：`,performance.now()-start);
}

let selectMessage1 = async ()=>{
    let start = performance.now();
    let data = dbMessage.select("Content like '%九万%'")
    console.log(data)
    console.log("模糊查询",performance.now()-start);
}

// let selectMessage2 = async ()=>{
//     let start = performance.now();
//     const msgs = db.objects(ModelMessage);
//     let data = msgs.filtered("fromUserName == $1 && messageContent CONTAINS $0", '九万里',"李清照");
//     console.log(data[0]["messageContent"]);
//     console.log("多条件+模糊查询",performance.now()-start);
// }

// let insertData = async ()=>{
//     let flag = true;
//     setInterval(async ()=> {
//         let fromUserName= flag?"李清照":"辛弃疾";
//         let toUserName= flag?"辛弃疾":"李清照";
//         let obj = {
//             _id: new Realm.BSON.ObjectID(),
//             fromUserName,
//             toUserName,
//             messageContent:`这是${fromUserName}发送给${toUserName}的消息，这条消息并不重要！`,
//             sendTime:new Date()
//           };
//           db.write(()=>{db.create(ModelMessage, obj)});
//           flag = !flag;
//           console.log("插入一条数据")
//     },18)
// }

// let handleWriteData = ()=>{
//     ipcMain.handle("writeToDb",async (event,data)=>{
//         data._id = new Realm.BSON.ObjectID();
//         await db.write(()=>{db.create(ModelMessage, data)});
//         return true;
//     })
// }

// app.on("quit",()=>{
//     db.close();
// })

let init = async ()=>{
    let start = performance.now();
    // await openDb();
    // await initUser();
    // await initMessage();
    // await selectMessage2();   
    // await insertData(); 
    // handleWriteData();
    await creatreWindow();
    initUser();
    initMessage();
    selectMessage1();
    // await creatreWindow();
    console.log(performance.now()-start);
}

app.whenReady().then(init)
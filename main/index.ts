import {app, BrowserWindow,ipcMain} from "electron";
import path from "path";
import fsex from "fs-extra"
import crypto from "crypto"
import { ModelUser } from "../common/ModelUser";
import { dbUser } from "../common/dbUser";
process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = "true";
let wins:BrowserWindow[] = [];

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
    console.log(111); 
    let user = new ModelUser();
    user.UserName = "李清照"
    dbUser.insert(user);
    console.log(222); 
    let a = dbUser.select()
    console.log(a);
}

// let initMessage = async ()=>{
//     let msgs = db.objects(ModelMessage);
//     let count = 300000;
//     if(msgs.length >= count) {
//         console.log("未插入数据，数据已存在：",msgs.length);
//         return;
//     };
//     let start = performance.now();
//     await db.write(()=>{
//         for(let i=0;i<count;i++){
//             let fromIndex = i%2;
//             let toIndex = fromIndex==1?0:1;
//             let obj = {
//                 _id: new Realm.BSON.ObjectID(),
//                 fromUserName: users[fromIndex]["userName"],
//                 toUserName: users[toIndex]["userName"],
//                 messageContent:"",
//                 sendTime:new Date()
//               };
//               if(i == count/2 ){
//                 obj.messageContent = `这是${users[fromIndex]["userName"]}发送给${users[toIndex]["userName"]}的第${i}条消息，
//                 天接云涛连晓雾，星河欲转千帆舞。仿佛梦魂归帝所。闻天语，殷勤问我归何处！我报路长嗟日暮，学诗谩有惊人句。九万里风鹏正举。风休住，蓬舟吹取三山去！`;
//               }else{
//                 obj.messageContent = `这是${users[fromIndex]["userName"]}发送给${users[toIndex]["userName"]}的第${i}条消息，这条消息并不重要！`;
//               }
//             db.create(ModelMessage, obj);
//         }
//     })
//     console.log(`单表插入${count}数据：`,performance.now()-start);
// }

// let selectMessage1 = async ()=>{
//     let start = performance.now();
//     const msgs = db.objects(ModelMessage);
//     let data = msgs.filtered("messageContent CONTAINS $0", '九万里');
//     console.log(data[0]["messageContent"]);
//     console.log("模糊查询",performance.now()-start);
// }

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
    // await selectMessage1();
    // await selectMessage2();   
    // await insertData(); 
    // handleWriteData();
    await creatreWindow();
    initUser();
    // await creatreWindow();
    console.log(performance.now()-start);
}

app.whenReady().then(init)
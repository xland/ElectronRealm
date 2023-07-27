import {ipcRenderer} from "electron";
import path from "path";
import Realm from "realm";
import {ModelMessage} from "../common/ModelMessage"
import {ModelUser} from "../common/ModelUser"
import fsex from "fs-extra"
import crypto from "crypto"

let db:Realm;

let openDb = async ()=>{
    let dbPath = path.join(process.env["APPDATA"] as string,"electron","db");
    let exist = await fsex.pathExists(dbPath);
    if(!exist){
        await fsex.mkdir(dbPath);
    }

    let key = new Int8Array(64);
    let userId = "liuxiaolun"
    userId = `***!!!${userId}!!!***`//加盐
    userId = crypto.createHash('md5').update(userId).digest('hex');
    for(let i=0;i<64;i++){
        key[i] = parseInt(userId[i>=32?i-32:i], 36);
    }
    db = await Realm.open({
        path: path.join(dbPath,"db"),
        schema: [ModelUser,ModelMessage],
        encryptionKey: key
      });
}

let selectMessage1 = async ()=>{
    let start = performance.now();
    const msgs = db.objects(ModelMessage);
    let data = msgs.filtered("messageContent CONTAINS $0", '九万里');
    console.log(data[0]["messageContent"]);
    console.log("模糊查询",performance.now()-start);
}

let selectMessage2 = async ()=>{
    let start = performance.now();
    const msgs = db.objects(ModelMessage);
    let data = msgs.filtered("fromUserName == $1 && messageContent CONTAINS $0", '九万里',"李清照");
    console.log(data[0]["messageContent"]);
    console.log("多条件+模糊查询",performance.now()-start);
}

let insertData1 = async ()=>{
    let flag = true;
    setInterval(async ()=> {
        let fromUserName= flag?"李清照":"辛弃疾";
        let toUserName= flag?"辛弃疾":"李清照";
        let obj = {
            _id: new Realm.BSON.ObjectID(),
            fromUserName,
            toUserName,
            messageContent:`这是${fromUserName}发送给${toUserName}的消息，这条消息并不重要！`,
            sendTime:new Date()
          };
          db.write(()=>{db.create(ModelMessage, obj)});
          flag = !flag;
          console.log("插入一条数据")
    },18)
}

let insertData2 = async ()=>{
    let flag = true;
    setInterval(async ()=> {
        let fromUserName= flag?"李清照":"辛弃疾";
        let toUserName= flag?"辛弃疾":"李清照";
        let obj = {
            fromUserName,
            toUserName,
            messageContent:`这是${fromUserName}发送给${toUserName}的消息，这条消息并不重要！`,
            sendTime:new Date()
          };
          await ipcRenderer.invoke("writeToDb",obj)
          flag = !flag;
          console.log("插入一条数据")
    },18)
}

let dataChangeEvent = ()=>{
    const msgs = db.objects(ModelMessage);
    msgs.addListener((dataList, changes)=>{
        changes.insertions.forEach((index) => {
            const insertedMsg = dataList[index];
            console.log(`监听到数据插入: ${JSON.stringify(insertedMsg)}`);
          });
    })
}

let init = async ()=>{
    let start = performance.now();
    await openDb();
    await selectMessage1();
    await selectMessage2();
    // await insertData();
    // dataChangeEvent();
    document.querySelector("#startInsertBtn")?.addEventListener("click",()=>{
        insertData2()
    })
    console.log(performance.now()-start);
}
init();

//todo 
// window.addEventListener("beforeunload",()=>{
//     console.log("db close");
//     db.close();
//     return "window close";
// })

// app.on("quit",()=>{
//     db.close();
// })
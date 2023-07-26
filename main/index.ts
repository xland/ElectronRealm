import {app, BrowserWindow} from "electron";
import path from "path";
import Realm from "realm";
import {ModelMessage} from "./ModelMessage"
import {ModelUser} from "./ModelUser"
import fsex from "fs-extra"

let win:BrowserWindow;
let db:Realm;
let users:Realm.Results<ModelUser>;


let creatreWindow = async ()=>{
    win = new BrowserWindow(
        {
            webPreferences:{
                nodeIntegration:true,
                sandbox:false,
                webSecurity:false,
            }
        }
    );
    await win.loadFile(path.join(__dirname,"index.html"));
    win.show();
}

let openDb = async ()=>{
    let dbPath = path.join(app.getPath("userData"),"db");
    let exist = await fsex.pathExists(dbPath);
    if(!exist){
        await fsex.mkdir(dbPath);
    }
    db = await Realm.open({
        path: path.join(dbPath,"db"),
        schema: [ModelUser,ModelMessage],
      });
}


let initUser = async ()=>{    
    users = db.objects(ModelUser);
    if(users.length > 0) {
        return;
    };
    await db.write(() => {
        db.create(ModelUser, {
          _id: new Realm.BSON.ObjectID(),
          userName: "李清照",
        });
        db.create(ModelUser, {
            _id: new Realm.BSON.ObjectID(),
            userName: "辛弃疾",
        });
      });
}

let initMessage = async ()=>{
    let start = performance.now();
    await db.write(()=>{
        for(let i=0;i<10000;i++){
            let fromIndex = i%2;
            let toIndex = fromIndex==1?0:1;
            let obj = {
                _id: new Realm.BSON.ObjectID(),
                fromUserName: users[fromIndex]["userName"],
                toUserName: users[toIndex]["userName"],
                messageContent:"",
                sendTime:new Date()
              };
              if(i == 600){
                obj.messageContent = `这是${users[fromIndex]["userName"]}发送给${users[toIndex]["userName"]}的第${i}条消息，
                天接云涛连晓雾，星河欲转千帆舞。仿佛梦魂归帝所。闻天语，殷勤问我归何处！我报路长嗟日暮，学诗谩有惊人句。九万里风鹏正举。风休住，蓬舟吹取三山去！`;
              }else{
                obj.messageContent = `这是${users[fromIndex]["userName"]}发送给${users[toIndex]["userName"]}的第${i}条消息，这条消息并不重要！`;
              }
            db.create(ModelMessage, obj);
        }
    })
    console.log("单表插入数据：",performance.now()-start);
}

let selectMessage = async ()=>{
    let start = performance.now();
    const msgs = db.objects(ModelMessage);
    let data = msgs.filtered("messageContent CONTAINS $0", '九万里');
    console.log(data[0]["messageContent"]);
    console.log("查询时间",performance.now()-start);
}

let init = async ()=>{
    let start = performance.now();
    await creatreWindow();
    await openDb();
    await initUser();
    await initMessage();
    await selectMessage();
    console.log(performance.now()-start);
}
app.whenReady().then(init)
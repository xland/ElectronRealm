import { ModelUser } from "../common/ModelUser";
import { dbUser } from "../common/dbUser";
import { dbMessage } from "../common/dbMessage";
import { ModelMessage } from "../common/ModelMessage";


let insertData = async ()=>{
    let users = dbUser.selectAll() as ModelUser[]
    let flag = true;
    setInterval(async ()=> {
        let fromUserIndex= flag?0:1;
        let toUserIndex= flag?1:0;
        let obj = new ModelMessage();
        obj.FromUserId = users[fromUserIndex].ID;
        obj.ToUserId = users[toUserIndex].ID;
        obj.SendTime = Date.now();
        obj.Content = `这是${users[fromUserIndex].UserName}发送给${users[toUserIndex].UserName}的消息，
    天接云涛连晓雾，星河欲转千帆舞。仿佛梦魂归帝所。闻天语，殷勤问我归何处！我报路长嗟日暮，学诗谩有惊人句。九万里风鹏正举。风休住，蓬舟吹取三山去！`;
          flag = !flag;
          dbMessage.insertOne(obj);
          console.log("插入一条数据")
    },18)
}


let init = async ()=>{
    document.querySelector("#startInsertBtn")?.addEventListener("click",()=>{
        insertData()
    })
}
init();
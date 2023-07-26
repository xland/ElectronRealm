import Realm from "realm";
export class ModelMessage extends Realm.Object {
    static schema = {
      name: "Message",
      properties: {
        _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
        fromUserName: "string?",
        toUserName: "string?",
        fromUserId: 'objectId?',
        toUserId: 'objectId?',
        messageContent: "string?",
        sendTime:"date?"
      },
      primaryKey: "_id",
    };
  }
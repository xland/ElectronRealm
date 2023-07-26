import Realm from "realm";
export class ModelUser extends Realm.Object {
    static schema = {
      name: "User",
      properties: {
        _id: {type: 'objectId', default: () => new Realm.BSON.ObjectId()},
        userName: "string?",
      },
      primaryKey: "_id",
    };
  }
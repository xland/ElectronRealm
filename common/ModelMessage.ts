import { ModelBase } from "./ModelBase";

export class ModelMessage extends ModelBase {
  FromUserId:string
  ToUserId:string
  Content:string
  SendTime:number
  constructor(){
      super();
  }
}
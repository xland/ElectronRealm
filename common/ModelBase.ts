import crypto from "crypto"
export class ModelBase{
    ID:string
    constructor(){
        this.ID = crypto.randomUUID()
    }
}
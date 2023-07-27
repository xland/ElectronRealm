import crypto from "crypto"
export class Model{
    ID:string
    constructor(){
        this.ID = crypto.randomUUID()
    }
}
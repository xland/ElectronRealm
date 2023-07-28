import crypto from "crypto"
/**
 * 数据模型基类
 */
export class ModelBase{
    /**
     * 主键，
     * 是在构造函数中初始化的
     */
    ID:string
    constructor(){
        this.ID = crypto.randomUUID()
    }
}
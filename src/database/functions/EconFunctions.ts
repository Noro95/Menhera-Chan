import { waifu } from "../schemas/waifu";
import { economyUser } from "../schemas/EconomyUser";

export async function initEcoUser(user:string){
    const profile = await economyUser.findOne({user:user}).exec()
    if(!profile){
        economyUser.create({
            user: user,
            balance: 0,
            characters: []
        })
    }
}

export async function getUser(id:string) {
    return await economyUser.findOne({user:id}).exec()
}

export async function getUserWaifus(id:string) {
    var data = await economyUser.findOne({user:id}).exec()
    return data.characters
}

export async function getBalance(id:string) {
    var data = await economyUser.findOne({user:id}).exec()
    return data.balance
}

export async function addBalance(user:string,balance:number) {
    var profile = await economyUser.findOne({user:user})
    if(!profile){return initEcoUser(user)}
    var newbal = balance+profile.balance
    await economyUser.findOneAndUpdate({user:user},{balance:newbal})
}
export async function sellWaifu(user:string,id:string) {
    var data = await economyUser.findOne({user:user}).exec()
    var index = data.characters.indexOf(id)
    data.characters.splice(index,1)
    await economyUser.findOneAndUpdate({user:user},{characters:data.characters})
}

export async function updateBalance(user:string,balance:number) {
    await economyUser.findOneAndUpdate({user:user},{balance:balance})
}

export async function getWaifu(name:string) {
    return await waifu.find({
        name:{$regex: name, $options: 'i'} 
    });
}

export async function getWaifuByID(ID:string) {
    return await waifu.findOne({id:ID});
}
export async function getWaifuByIDArray(array:Array<string>) {
    return await waifu.find({id:{$in:array}}).exec()
}

export async function getProduct(id:string){
    return await waifu.findOne({id: id})
}

export async function updateWaifu(ID:number,N:string,I:string,G:string,A:string,C:string){
    var data = await waifu.findOne({id:ID})
    if(data == null)return false
    if(N == null){N = data.name}
    if(I == null){I = data.image}
    if(G == null){G = data.gender}
    if(A == null){A = data.anime}
    if(C == null){C = data.cost}
    try{
    await waifu.findOneAndUpdate({id:ID},{name:N,image:I,gender:G,anime:A,cost:C}).catch(console.error)
    }catch{
        return false
    }finally{
        return true
    }
}
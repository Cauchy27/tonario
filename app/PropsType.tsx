type NameList = {
  uid:number,
  username:string,
  power:number, //0-10
  compatibillity:CompatibillityToOthers[],
  check:boolean
}
type CompatibillityToOthers = {
  to_uid:number,
  to_username:string,
  point:number //0-100
}

export type{
  NameList,
  CompatibillityToOthers,
}
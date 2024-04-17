type NameList = {
  uid:number,
  username:string,
  power:number, //0-10
  compatibillity:CompatibillityToOthers[],
  check:boolean,
  position:Position
}
type CompatibillityToOthers = {
  to_uid:number,
  to_username:string,
  point:number //0-100
}
type Position = {
  x:number,
  y:number
}

export type{
  NameList,
  CompatibillityToOthers,
}
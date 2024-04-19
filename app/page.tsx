"use client"
import type { NextPage } from 'next'
import { useEffect, useState } from "react";


import { Grid, Typography, Button } from '@mui/material';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CelebrationIcon from '@mui/icons-material/Celebration';

import { NameList, CompatibillityToOthers } from './PropsType';
import { NameBox } from './components/namebox';

const getDefaultMap = () => {
  let defaultMap:string[][] = []
  columns.forEach((col,key_col)=>{
    defaultMap.push([]);
    rows.forEach(()=>{
      defaultMap[key_col].push("×")
    })
  })
  return defaultMap;
}

const Main:NextPage = () => {
  const defaultMap = getDefaultMap();

  const [NameList, setNameList] = useState<NameList[]>([]);
  const [sittingMap, setSittingMap] = useState<string[][]>(defaultMap);

  // const [mapLength, setMapLenght] = useState<number>(10);

  // ロード時にローカルにデータを持っていれば呼び出し
  useEffect(()=>{
    const loadListJson:string = localStorage.getItem("name_list")??"";
    if(loadListJson != ""){
      setNameList(JSON.parse(localStorage.getItem("name_list")??""))
    }

    const loadMapJson:string = localStorage.getItem("sitting_map")??"";
    if(loadMapJson != ""){
      setSittingMap(JSON.parse(localStorage.getItem("sitting_map")??""))
    }

    // const loadMapLength:string = localStorage.getItem("mapLength")??"";
    // if(loadMapLength != ""){
    //   setMapLenght(JSON.parse(localStorage.getItem("mapLength")??""))
    // }
  },[])

  const addNameList = () => {
    let newNameList = [...NameList];

    const newUid = Math.round((new Date()).getTime() / 1000);
    let CompatibillityToOthersArray:CompatibillityToOthers[] = [];

    NameList.map((name,key)=>{
      CompatibillityToOthersArray.push(
        {
          to_uid:name.uid,
          to_username:name.username,
          point:50
        }
      );
      newNameList[key].compatibillity.push(
        {
          to_uid:newUid,
          to_username:"",
          point:50
        }
      )
    })
    const nameArray:NameList = {
      uid:newUid,
      username:"",
      power:5,
      compatibillity:CompatibillityToOthersArray,
      check:true,
      position:{
        x:0,
        y:0
      }
    }
    newNameList.push(nameArray);
    setNameList(newNameList);
  }

  const updateNameList = (key:number,newNameArray:NameList) => {
    console.log(newNameArray, NameList)
    let newNameList = [...NameList];

    // 他からの名前をアップデート
    newNameList.map((name2,key2)=>{
      if(key2 != key){
        name2.compatibillity.map((name3)=>{
          if(name3.to_uid == newNameArray.uid){
            name3.to_username = newNameArray.username
          }
        });
      }
    });

    newNameList[key] = newNameArray;

    setNameList(newNameList);
    window.localStorage.setItem("name_list", JSON.stringify(newNameList));
  }

  // 盤面リセット
  const resetSeats = () => {
    const newSittingMap = defaultMap;
    setSittingMap(newSittingMap);
    // window.localStorage.setItem("sitting_map", JSON.stringify(newSittingMap));
  }

  // 座席マッチング
  const selectSeats = async() => {
    let newNameList= [...NameList];
    let rowsArray = [...rows];
    let columnsArray = [...columns];

    // バツは保存しておく
    let newSittingMap= sittingMap.map((row)=>{
      let rowOutput:string[] 
      rowOutput = row.map((cell:string)=>{
        return cell == "×"?"×":"";
      });
      return rowOutput;
    })

    // リセット用
    const newSittingMapCopy = JSON.parse(JSON.stringify(newSittingMap));
    const newNameListCopy = JSON.parse(JSON.stringify(newNameList));
    
    let noSeatCount=0;
    let maxMatchingPoint = 0;
    let lastMatchingPoint = 0;
    let matchingCount = 0;

    // ランダムに配置
    while((matchingCount < 10 || lastMatchingPoint < maxMatchingPoint) && matchingCount < 50){
      lastMatchingPoint = 0;
    // while(matchingCount<3){
      newSittingMap = JSON.parse(JSON.stringify(newSittingMapCopy));
      newNameList = JSON.parse(JSON.stringify(newNameListCopy));
      NameList.forEach((name,key)=>{
        if(name.check){
          // x
          let x_index = Math.floor(Math.random() * columnsArray.length);
          let test = 0;
          while(!newSittingMap[x_index].includes("")){
            if(test > rows.length*columns.length){
              noSeatCount++;
              x_index = rows.length;
              break;
            }
            x_index = Math.floor(Math.random() * columnsArray.length);
            test++
          }
          newNameList[key].position.x = columnsArray[x_index];
          console.log(matchingCount,"x",newNameList[key].position.x);
    
          // y
          let y_index = Math.floor(Math.random() * rowsArray.length);
          if(test <= rows.length*columns.length){
            while(newSittingMap[x_index][y_index] != ""){
              if(test > rows.length*columns.length){
                noSeatCount++;
                y_index = columns.length;
                break;
              }
              y_index = Math.floor(Math.random() * rowsArray.length);
              test++;
            }
          }
          else{
            y_index = columns.length;
          }
          newNameList[key].position.y = rowsArray[y_index];
          console.log(matchingCount,"y",newNameList[key].position.y);
          
          if(test <= rows.length*columns.length){
            newSittingMap[x_index][y_index]=newNameList[key].username;
          }
          // console.log(test, rows.length*columns.length);
          // console.log(newSittingMap, newNameList);
        }
      });
      if(noSeatCount > 0){
        alert(noSeatCount + "：座れていない人がいます...");
        console.log("count",matchingCount,maxMatchingPoint);
        matchingCount = 100;
        // break;
      }

      // マッチングポイントを計算：距離 * 相手への相性*権力
      newNameList.map((name)=>{
        name.compatibillity.map((partner)=>{
          const partnerData = newNameList.find((val)=>val.uid == partner.to_uid);
          console.log(partnerData);
          if(partnerData){
            lastMatchingPoint += (name.power * partner.point)^2 + ((partnerData.position.x,name.position.x - partnerData.position.x)^2+(name.position.y - partnerData.position.y)^2);
          }
          else{
            lastMatchingPoint = 0;
          }
        })
      });
      if(lastMatchingPoint >= maxMatchingPoint){
        maxMatchingPoint = lastMatchingPoint;
      }
      console.log("matchingPoint",lastMatchingPoint);
      matchingCount++;
    }
    if(matchingCount >= 50){
      alert("座席マッチングに失敗しました...")
    }
    else{
      console.log("success",maxMatchingPoint);
    }
    
    setSittingMap(newSittingMap);
    window.localStorage.setItem("sitting_map", JSON.stringify(newSittingMap));
    setNameList(newNameList);
    window.localStorage.setItem("name_list", JSON.stringify(newNameList));
  }

  // 座席にポイント指定
  const seatStatusChange = (col:number,row:number) => {
    let newSittingMap = [...sittingMap];

    switch(sittingMap[col][row]){
      case "×":
        newSittingMap[col][row] = "";
        break;

      case "":
        newSittingMap[col][row] = "×";
        break;
    }
    
    setSittingMap(newSittingMap);
    window.localStorage.setItem("sitting_map", JSON.stringify(newSittingMap));
  }

  return(
    <div className='w-[100%] h-[100%]'>
      <Typography variant='h2' textAlign={"center"} sx={{height:"80px"}}>tonario</Typography>
      <Typography variant='h5' textAlign={"center"} sx={{height:"50px"}}>〜となりの人との交流を創出する 座席決めアプリ〜</Typography>
      <Grid
        container
        justifyContent={"center"}
        textAlign={"center"}
        overflow={"scroll"}
        className='w-[100%] h-[calc(100%_-_130px)]'
      >
        <Grid
          item
          xs={12}
          xl={11}
          md={3}
          sx={{
            bgcolor:"white",
            display:"flex"
          }}
        >
          <Grid
            container
            flexDirection={"column"}
            overflow={"scroll"}
          >
            <Grid
              item
              xl={1}
            >
              <Typography variant='h5' sx={{color:"black",m:1}}>〜名前と相性を入力〜</Typography>
            </Grid>
            <Grid
              item
              xl={9}
              sx={{
                flexDirection:"column",
                overflow:"scroll"
              }}
            >
              {
                NameList.map((name,key)=>{
                  return(
                    <NameBox
                      key={key}
                      id={key}
                      data={name}
                      updateNameList={updateNameList}
                    />
                  )
                })
              }
              <Button
                endIcon={<AddBoxIcon/>}
                // variant="outlined"
                onClick={()=>{addNameList()}}
              >
                人数を増やす
              </Button> 
            </Grid>
            <Grid
                item
                xl={1}
            >
              <Button
                endIcon={<CelebrationIcon/>}
                variant="contained"
                color="secondary"
                sx={{m:3, mb:1, width:"50%"}}
                onClick={()=>{
                  selectSeats()
                }}
              >
                席決め！
              </Button>
              <Button
                endIcon={<CelebrationIcon/>}
                variant="contained"
                color="error"
                sx={{m:3, mt:1, width:"50%"}}
                onClick={()=>{
                  resetSeats()
                }}
              >
                リセット
              </Button>
              <Typography variant='h6' sx={{color:"black"}}>※座席決めは現在開発中のため、<br/>完全ランダムとなっています。</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{bgcolor:"blue"}}
        >
          {/* <Typography variant='h2'>ここに</Typography> */}
          <Grid
            container
            justifyContent={"center"}
            flexDirection={"row"}
            sx={{width:"100%",height:"100%"}}
          >
            {
              columns.map((column,key_col)=>{
                return(
                  <Grid
                    key={key_col}
                    item
                    xs={1}
                    sx={{
                      border:1,
                      display:"flex",
                      flexDirection:"column",
                      justifyContent:"center",
                    }}
                    flexGrow={1}
                  >
                    { sittingMap[key_col] &&
                      rows.map((row,key_row)=>{
                        return(
                          <Grid
                            key={key_row}
                            sx={{
                              border:1,
                              flexGrow:1
                            }}
                            >
                              <Button 
                                onClick={()=>{
                                  console.log("click!")
                                  seatStatusChange(key_col, key_row);
                                }}
                                sx={{
                                  color:sittingMap[key_col][key_row]==""?"white":"black",
                                  bgcolor:sittingMap[key_col][key_row]==""?"blue":(sittingMap[key_col][key_row]=="×"?"white":"#ff8c00"),
                                  width:"100%",
                                  height:"100%"
                                }}
                              >
                                {sittingMap[key_col][key_row]!=""?sittingMap[key_col][key_row]:"⚪︎"}
                              </Button>
                          </Grid>
                        )
                      })
                    }
                  </Grid>
                )
              })
            }
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

const rows:number[] = [1,2,3,4,5,6,7,8,9,10];
const columns:number[] = [1,2,3,4,5,6,7,8,9,10];

export default Main;
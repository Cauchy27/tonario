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
      defaultMap[key_col].push("")
    })
  })
  return defaultMap;
}

const Main:NextPage = () => {
  const defaultMap = getDefaultMap()

  const [NameList, setNameList] = useState<NameList[]>([]);
  const [sittingMap, setSittingMap] = useState<string[][]>(defaultMap);

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

  // まずランダムに場所配置
  const selectSeats = async() => {
    let newNameList = [...NameList];
    let rowsArray = [...rows];
    let columnsArray = [...columns];

    let newSittingMap = defaultMap;

    // テーブルとか座れない場所を指定するためには、ここでその場所を削っておく

    // 座席を取得
    NameList.forEach((name,key)=>{
      if(name.check){
        // x
        const x_index = Math.floor(Math.random() * columnsArray.length);
        newNameList[key].position.x = 10;
        columnsArray.splice(x_index,1);
  
        // y
        const y_index = Math.floor(Math.random() * rowsArray.length);
        newNameList[key].position.y = rowsArray[y_index];
        rowsArray.splice(y_index,1);
        
        newSittingMap[x_index][y_index]=newNameList[key].username;
      }
    });
    
    setSittingMap(newSittingMap);
    window.localStorage.setItem("sitting_map", JSON.stringify(newSittingMap));
    setNameList(newNameList);
    window.localStorage.setItem("name_list", JSON.stringify(newNameList));
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
                sx={{m:3, width:"50%"}}
                onClick={()=>{
                  selectSeats()
                }}
              >
                席決め！
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
                    {
                      rows.map((row,key_row)=>{
                        return(
                          <Grid
                            key={key_row}
                            sx={{
                              border:1,
                              flexGrow:1
                            }}
                            >
                            {sittingMap[column-1][row-1]!=""?sittingMap[column-1][row-1]:"-"}
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

const rows:number[] = [1,2,3,4,5,6,7,8,9,10,11,12]
const columns:number[] = [1,2,3,4,5,6,7,8,9,10,11,12]

export default Main;
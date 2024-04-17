"use client"
import type { NextPage } from 'next'
import { useEffect, useState } from "react";


import { Grid, Typography, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import { NameList, CompatibillityToOthers } from './PropsType';
import { NameBox } from './components/namebox';

const Main:NextPage = () => {

  const [NameList, setNameList] = useState<NameList[]>([]);

  // ロード時にローカルにデータを持っていれば呼び出し
  useEffect(()=>{
    const loadDataJson:string = localStorage.getItem("name_list")??"";
    if(loadDataJson != ""){
      setNameList(JSON.parse(localStorage.getItem("name_list")??""))
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
      check:true
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
        })
      }
    })

    newNameList[key] = newNameArray;

    setNameList(newNameList);

    window.localStorage.setItem("name_list", JSON.stringify(newNameList));
  }

  return(
    <div className='w-[100%] h-[100%]'>
      <Typography variant='h2' textAlign={"center"} sx={{height:"100px"}}>tonario</Typography>
      <Typography variant='h5' textAlign={"center"} sx={{height:"50px"}}>〜となりの人との交流を創出する 座席決めアプリ〜</Typography>
      <Grid
        container
        justifyContent={"center"}
        textAlign={"center"}
        overflow={"scroll"}
        className='w-[100%] h-[calc(100%_-_150px)]'
      >
        <Grid
          item
          xs={12}
          md={3}
          sx={{
            bgcolor:"white",
            display:"flex",
            flexDirection:"column",
          }}
        >
          <Typography variant='h4' sx={{color:"black"}}>〜名前を入力〜</Typography>
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
            startIcon={<AddIcon/>}
            onClick={()=>{addNameList()}}
          >
          </Button>
        </Grid>
        <Grid
          item
          xs={12}
          md={9}
          sx={{bgcolor:"blue"}}
        >
          <Typography variant='h2'>ここに</Typography>
        </Grid>

      </Grid>
    </div>
  )
}

export default Main;
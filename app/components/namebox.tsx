"use client"
import { useEffect, useState } from "react";

import { TextField, Grid, Button, Typography, Checkbox } from "@mui/material"
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';

import { NameList, CompatibillityToOthers } from '.././PropsType';

type NameBoxProps = {
  id:number,
  data:NameList,
  updateNameList:(key: number, newNameArray: NameList)=> void
}

const NameBox = (props:NameBoxProps) => {

  const [open, setOpen] = useState<boolean>(false);
  const openChange = () => {
    if(open){
      setOpen(false);
    }
    else{
      setOpen(true);
    }
  }

  return(
    <Grid
      sx={{m:1}}
    >
      <Checkbox 
        defaultChecked
      />
      <TextField
        defaultValue={props.data.username}
        variant="standard"
        onChange={(event)=>{
          let newNameArray = props.data;
          newNameArray.username = event.target.value;
          props.updateNameList(props.id, newNameArray);
        }}
      />
      <Button
        startIcon={<ExpandCircleDownIcon/>}
        onClick={()=>{openChange()}}
      />
      {
        open && props.data.compatibillity && 
        <>
          <TextField
            label={props.data.username + "の権力[1-10]"}
            defaultValue={props.data.power}
            onChange={(event)=>{
              let newNameArray = props.data;
              newNameArray.power = Math.round(Number(event.target.value));
              props.updateNameList(props.id, newNameArray);
            }}
            size="small"
            sx={{m:2}}
          />
          {
            props.data.compatibillity.map((comp,key)=>{
              return(
                <TextField
                  key={key}
                  label={comp.to_username + "への好感度[1-100]"}
                  defaultValue={comp.point}
                  onChange={(event)=>{
                    let newNameArray = props.data;
                    newNameArray.compatibillity[key].point = Math.round(Number(event.target.value));
                    props.updateNameList(props.id, newNameArray);
                  }}
                  sx={{m:2}}
                />
              )
            })
          }
        </>
      }
    </Grid>
  )

}

export {
  NameBox
}
import React, {useRef, useEffect, useState} from 'react';
import { Button, Grid, Typography, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { TypographyStyle } from './Rooms';

export default function User(props) {
    const {user, ri, ui, removeUser, changeRoomNumber} = props;
    const [isEditable, setIsEditable] = useState(false);
    const [changeToRoom, setChangeToRoom] = useState(user.roomId);
    const inputRef = useRef();

        useEffect(() => {
          function handleClickOutside(event) {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
              setIsEditable(false)
            }
          }
          document.addEventListener("mousedown", handleClickOutside);
          return () => {
            document.removeEventListener("mousedown", handleClickOutside);
          };
        }, [inputRef]);
       

    

    return ( 
            <Grid item sx={{border: "1px solid black", borderRadius: "20px", padding: "10px", height: "200px"}}>
                <Typography align='left' sx={TypographyStyle}>First name: {user.firstName} </Typography>
                <Typography align='left' sx={TypographyStyle}>Last name: {user.lastName} </Typography>
                <Typography align='left' sx={TypographyStyle}>Email: {user.email} </Typography>
                <Typography align='left' sx={TypographyStyle} style={{fontWeight: 600}}>{user.isAdmin ? "Admin" : "User"} </Typography>
                <Grid item container alignItems="center" ref={inputRef}>
                  <Typography align='left' sx={TypographyStyle}>Room ID: </Typography>   
                  {isEditable ? <TextField
                    value={changeToRoom}
                    size="small"
                    style={{width: "50px", marginLeft: "5px"}}
                    onChange={e => setChangeToRoom(e.target.value)}
                    ref={inputRef}   
                  /> :
                   <Typography align='left' sx={TypographyStyle} style={{marginLeft: "5px"}}>{user.roomId}</Typography> }
                {isEditable ? <Button variant="outlined" sx={{height: "40px", fontFamily: "Poppins"}} onClick={()=> {setIsEditable(false); changeRoomNumber(ri, ui, changeToRoom)}} startIcon={<BookmarkIcon />}>Save</Button> :
                <Button variant="outlined" size='small' sx={{margin: "0 15px ", fontFamily: "Poppins"}} onClick={()=> setIsEditable(true)} startIcon={<EditIcon />}>Edit</Button>}
                </Grid>
                <Button onClick={(e)=> removeUser(e, ri, ui, user.isAdmin)} sx={{marginTop: "5px", textTransform: "none", fontFamily: "Poppins", backgroundColor: "#CF142B", "&:hover": {backgroundColor: "#CF142B"}, color: "#fff", borderRadius: "10px" }}>Remove</Button>
                
              </Grid>
            
        
    )
}

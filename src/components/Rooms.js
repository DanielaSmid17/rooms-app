import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Grid, Typography, Snackbar } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';
import User from './User';

export default function Rooms() {
  const [usersInRoom, setUsersInRoom] = useState([])
  const [validRoomIds, setValidRoomsIds] = useState([])
  const [openSnackBar, setOpenSnackBar] = useState(false)
  const [openRoomSnackBar, setOpenRoomSnackBar] = useState(false)
 
  useEffect(() => {

    fetchData()

  }, []);

  const fetchData = async () => {
    const rooms = await fetchRooms()
    const users = await fetchUsers()

    usersPerRoom(rooms, users)
  }

  const fetchRooms = async () => {
    const rooms = await axios.get("https://61f992ba69307000176f7330.mockapi.io/rooms")
    createRoomsId(rooms?.data)
    return rooms?.data

  }

  const createRoomsId = (rooms) => {
    const ids = [];
    for (const room of rooms) {
      ids.push(room.id)
    }

    setValidRoomsIds(ids)

  }

  const fetchUsers = async () => {
    const users = await axios.get("https://61f992ba69307000176f7330.mockapi.io/users")
    return users?.data
  }

  // configure each room with corresponding users
  const usersPerRoom = (rooms, users) => {
    for (const room of rooms) {
      room.users = [];
    };

    for (const user of users) {
      for (const room of rooms) {
        if (room.id === user.roomId) {
          room.users.push(user)
        }
      }
    };

    setUsersInRoom(rooms);
  }

  // calculate total admins per room
  const checkTotalAdmins = (ri) => {
    const usersInRoomCopy = [...usersInRoom]
    const users = usersInRoomCopy[ri].users
    let count = 0
    for(const user of users) {
      if (user.isAdmin) count += 1
    }

    return count;

  }
  
  // Handle removing user 
  const removeUser = (e, ri, ui, isAdmin) => {
    const usersInRoomCopy = [...usersInRoom]
    const totalAdmins = checkTotalAdmins(ri)
    if (!isAdmin || (isAdmin && totalAdmins >= 2)) {
      usersInRoomCopy[ri].users.splice(ui, 1);
      setUsersInRoom(usersInRoomCopy);
    } else 
    setOpenSnackBar(true)

    if (usersInRoomCopy[ri].users.length === totalAdmins) {
      usersInRoomCopy[ri].isActive = false
      setUsersInRoom(usersInRoomCopy)

    }
      
  }

  // Handle close Snackbar (alert)
  const handleSnackBarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar(false);
  };

  const handleRoomSnackbarClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenRoomSnackBar(false);
  };

  const changeRoomNumber = (ri, ui, newNumber) => {
    const usersInRoomCopy = [...usersInRoom]
    if (validRoomIds.includes(newNumber) && newNumber !== usersInRoomCopy[ri].users[ui].roomId){
      usersInRoomCopy[ri].users[ui].roomId = newNumber 
      setUsersInRoom(usersInRoomCopy)
      usersInRoomCopy[ri].users.splice(ui, 1)
      for(const room of usersInRoomCopy){
        if (newNumber === room.id) {
          const newUser = usersInRoomCopy[ri].users[ui]
          newUser.roomId = newNumber
          room.users.unshift(newUser)
        }
      }
      setUsersInRoom(usersInRoomCopy)
    }
    else 
      setOpenRoomSnackBar(true)
  } 


  return (
    <>
    <Grid container justifyContent="center">
      {usersInRoom?.map((room, ri) => (
        <Grid key={ri} item sx={{border: "1px solid black", width: "300px", borderRadius: "20px", margin: "10px"}}>
          <Typography>Room ID: {room.id}</Typography>
          <BedIcon sx={{color: room.isActive ? "#00A67E" : "#CF142B", fontSize: "50px"}} />
          <Typography>Number of Users: {room.users.length}</Typography>
          {room.users.length > 0 && <Typography>Users' details: </Typography>}
          {room.users?.map((user, ui) => (
              <User key={ui} user={user} ri={ri} ui={ui} removeUser={removeUser} changeRoomNumber={changeRoomNumber} />
          ))}
        </Grid>
      ))}
      </Grid>
      <Snackbar
        open={openSnackBar}
        autoHideDuration={6000}
        onClose={handleSnackBarClose}
        message="Room cannot be without admin"
      />
      <Snackbar
        open={openRoomSnackBar}
        autoHideDuration={6000}
        onClose={handleRoomSnackbarClose}
        message="Room number is invaid"
      />
    </>
  )
}


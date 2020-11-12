import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

let socket;

const Chat = ({location}) => {

    const [name , setName] = useState('');
    const [room, setRoom] = useState('');
    const URL = 'localhost:8080'

    useEffect(() => {
        const { name, room } = queryString.parse(location.search)

        socket = io(URL)

        setName(name);
        setRoom(room)
        }, [URL, location.search])

    return ( 
        <>
            <h1>Chat</h1>
        </> 
    );
}
 
export default Chat;
import React, { useRef, useState } from 'react'
import Input from '../Input/Input';
import Button from '../Button/Button';
import './chat.css'
import { useAppDispatch, useAppSelector } from '../../hooks/redux';

export const Chat = () => {
    const {} = useAppSelector(state => state)
    const dispatch = useAppDispatch()

     const [inputValue, setInputValue] = useState();
     const chatInputRef = useRef(inputValue);
     const [messages, setMessages] = useState([
    /*    { text: "hello", date: Date.now(), id: 1 },
       { text: "hello2", date: Date.now(), id: 2 },
       { text: "hello3", date: Date.now(), id: 3 }, */
     ]);
     const sendMessage = () => {
       console.log(messages);
       setMessages([
         ...messages,
         {
           text: chatInputRef.current.value,
           Date: Date.now(),
           id: Math.random(),
         },
       ]);
       chatInputRef.current.value = "";
     };

  return (
    <div className="chat">
      <div className="chat_msgs">
        <div className="chat_msgs-inner">
          {messages.map((item, index) => (
            <div className="chat_message" key={item.id}>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="chat_input-block">
        <Input
          ref={chatInputRef}
          className="chat_input"
          name="chatInput"
          type="text"
          placeholder="Введите текст..."
        />
        <label htmlFor="chatInput">
          <Button onClick={sendMessage}>Send</Button>
        </label>
      </div>
    </div>
  );
}

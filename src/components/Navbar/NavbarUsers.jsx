import React, { useState } from 'react'
import './navbar.css'
import Button from '../Button/Button';
import { collection, getDocs, limit, query } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Input from '../Input/Input';

const NavbarUsers = ({chats}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [isFetchUsers, setIsFetchUsers] = useState(false)
  const [isOpenMenu, setIsOpenMenu] = useState(false)

  const [allUsers, setAllUsers] = useState([]);
  const [userChats, setUserChats] = useState([])


    const createChat = () => {
      setIsOpenMenu(true)
      /* getting data of all users */
     try {
       /* checking whether there was a request  */
       if (isFetchUsers) {
         return;
       } else {
         const q = query(collection(db, "users"), limit(15));

         getDocs(q).then((data) => {
           data.forEach((doc) => {
             setAllUsers((prev) => [...prev, doc.data()]);
           });
         });
         setIsFetchUsers(true);
       }
     } catch (error) {
      console.error(error)
     }
      /* ------------------------- */

      setIsLoading(false)
    }

    const addChat = (addedUser) => {
      console.log(
        userChats.find((item) => addedUser.id === item.id) === undefined
      );
      if (userChats.find((item) => addedUser.id === item.id) === undefined) {
        setUserChats((prev) => [...prev, addedUser]);
        setIsOpenMenu(false);
      } 
      
    };


    return (
      <nav className="navbarUsers">
        <div className="createChat_block" onClick={createChat}>
          <p>Create chat</p>
          <Button style={{ padding: "4px 8px 2px 8px" }}>+</Button>
          <div className="line"></div>
        </div>
          <ul className='userChats_block'>
            {userChats.map((chatItem, i) => (
              <div key={chatItem.id} className="userItem">
                <li>{chatItem.username}</li>
              </div>
            ))}
          </ul>
        {isOpenMenu && (
          <div className="createChatMenu">
            <div className="closeMenuBlock">
              <Button
                onClick={() => setIsOpenMenu(false)}
                style={{ padding: "4px 10px 3px 10px" }}
                className="closeBtn"
              >
                X
              </Button>
            </div>
            <div className="searchUser_block">
              <Input placeholder={"Search..."} type="text" />
            </div>
            {isLoading || (
              <ul className="nav_list listUsers">
                {allUsers.map((item, index) => (
                  <div key={item.id} className="userItem">
                    <li>{item.username} </li>
                    <Button onClick={() => addChat(item)} className={"createBtn"}>
                      Create
                    </Button>
                  </div>
                ))}
              </ul>
            )}
          </div>
        )}
      </nav>
    );
};

export default NavbarUsers
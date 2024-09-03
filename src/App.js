import { useEffect, useState } from 'react';
import './App.css';
import Button from './components/Button/Button';
import { Chat } from './components/Chat/Chat';
import Navbar from './components/Navbar/Navbar';
import NavbarUsers from './components/Navbar/NavbarUsers';
import {  doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from './lib/firebase';
import { toast, ToastContainer } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import upload from './lib/upload';


function App() {
  const navigate = useNavigate()
  let userID = useLocation().state;
  
  const [isLoading, setIsLoading] = useState(true)

  const [chats, setChats] = useState([])

  const [activeUser, setActiveUser] = useState({});
  const [avatar, setAvatar] = useState({
    file: null,
    url: '',
  })
  
  useEffect(() => {
    try {
      if (userID) {
        /* getting data of chats */
        onSnapshot(doc(db, "userchats", userID), async (res) => {
          const items = res.data().chats;

          const promisses = items.map(async (item) => {
            const userDocRef = doc(db, "users", item.receiverId);
            const userDocSnap = await getDoc(userDocRef);

            const user = userDocSnap.data();
            return {
              ...item,
              user,
            };
          });

          const chatData = await Promise.all(promisses);

          setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });
        /* --------------------- */
        /* getting data of logined user */
        onSnapshot(doc(db, "users", userID), async (res) => {
          setActiveUser({ ...res.data() });
        });
        /* ---------------------------- */
        setIsLoading(false);
      } else {
        return;
      }
      
    } catch (error) {
      toast.error("Error! You must log in to your account!");
      console.error("Error! You must log in to your account!", error);
    }
    

    return () => {};
  }, [userID]);


  const onSignOut = () => {
    console.log('click')
    signOut(auth)
      .then(() => {
        console.log('Sign out successfull')
      })
      .catch((error) => {
        console.error(error)
        toast.error('Error!')
      });
       setTimeout(() => {
         navigate("/login");
       }, 1000);
  }
  

  const handleAvatar = async (e) => {
    console.log(e.target.files[0].name.split('.')[0]);
    if (e.target.files[0]) {
      const imgUrl = await upload(e.target.files[0]);
      console.log("imgUrl", imgUrl);

      await setDoc(doc(db, "users", userID), {
        ...activeUser,
        avatar: imgUrl,
      });
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
      setActiveUser({...activeUser, avatar: imgUrl})
    }
  };

  return (
    <div className="App">
      {/* main page */}
      <div className="wrapper">
        <div className="main_chat-block">
          <div className="main_chat-inner">
            <div className="chat_header">
              <div className="login_btn-block">
                {activeUser.username ? (
                  <>
                    <div className="userBlock image-upload">
                      <label htmlFor="file-input">
                        <img
                          width={40}
                          height={40}
                          src={activeUser.avatar || "/user.png"}
                          alt="userimg"
                          style={{
                            cursor: "pointer",
                            borderRadius: `${"50%"}`,
                          }}
                        />
                      </label>
                      <input
                        id="file-input"
                        type="file"
                        onChange={(e) => handleAvatar(e)}
                      />
                      <h4>{activeUser.username}</h4>
                    </div>
                    <Button onClick={onSignOut}>Log out</Button>
                  </>
                ) : (
                  <>
                    <Link to={"/login"}>
                      <Button className={"loginBtn"}>Log in</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
            {activeUser.username ? (
              <div className="chat_main">
                <Navbar>
                  <li>Profile</li>
                  <li>Friends</li>
                  <li>Settings</li>
                </Navbar>
                {/* chat block */}
                {isLoading ? "Loading..." : <Chat />}
                <NavbarUsers chats={chats} />
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;

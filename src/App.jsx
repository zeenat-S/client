import React, { useState } from 'react'
import { StreamChat } from 'stream-chat'
import { Chat } from 'stream-chat-react'
import Cookies from 'universal-cookie'

// Auth is a new component for sign up and log in

import { ChannelContainer, ChannelListContainer, Auth } from './components'

import 'stream-chat-react/dist/css/index.css';
import './App.css';

const apiKey = 'wvwc6he34xxt';

// create an instance of stream chat for the chat to work

const client = StreamChat.getInstance(apiKey);

const cookies = new Cookies();

// when to call Auth ? 
// create an auth token which is available only if user is logged in
const authToken = cookies.get('token');

if (authToken) {
  client.connectUser({
    id: cookies.get('userId'),
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber')
  }, authToken)
}

const App = () => {

  // state for create type
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // if auth token is false we render the Auth component
  // this means if we are not logged in we hide everything and render the Auth component
  if (!authToken) {
    return <Auth />
  }

  return (
    <div>
      <div className='app__wrapper'>
        <Chat client={client} theme="team light">
          {/* channel container and channel list container */}
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
            setCreateType={setCreateType}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setIsEditing={setIsEditing}
            isEditing={isEditing} 
            createType = {createType}
            />
        </Chat>
      </div>
    </div>
  );
}

export default App

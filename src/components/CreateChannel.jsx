import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react'

import { UserList } from './'
import { CloseCreateChannel } from '../assets'

// component
const ChannelNameInput = ({ channelName = "", setChannelName }) => {

  const handleChannel = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  }

  return (
    <div className='channel-name-input__wrapper'>
      <p>Name</p>
      <input type="text" value={channelName} onChange={handleChannel} placeholder="channel-name" />
      <p>Add Members</p>
    </div>
  )
}

const CreateChannel = ({ createType, setIsCreating }) => {

  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || '']);

  // creating useState for Channel Name 
  const [channelName, setChannelName] = useState("");

  const createChannel = async (event) => {
    event.preventDefault();
    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName, members: selectedUsers
      });
      await newChannel.watch();

      // clean up
      setChannelName('');
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p>{createType === "team" ? "Create a New Channel" : "Send a Direct Message"}</p>
        <CloseCreateChannel setIsCreating={setIsCreating} />
      </div>
      {/* the following line means that channel name input component will be called
      only if the createType of creatChannel is team */}
      {createType === "team" && <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />}
      {/* in the above case where we have a pair of somethinf=g and setSomething we usually need a useState  */}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className='create-channel__button-wrapper' onClick={createChannel}>
        <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
      </div>
    </div>
  )
}

export default CreateChannel

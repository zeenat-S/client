import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

// whatever components are rendered inside the react helper functional component will be populated in children
const ListContainer = ({ children }) => {
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {

    const [selected, setSelected] = useState(false);

    const handleSelect = () => {

        if (selected) {
            // keeping all the selected users and removing the one we clicked currently
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }
        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className='user-item__wrapper' onClick={handleSelect}>
            <div className='user-item__name-wrapper'>
                {/* want to have access to the current user we are mapping over */}
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className='user-item__name'>{user.fullName || user.id}</p>
            </div>

            {selected ? <InviteIcon /> : <div className='user-item__invite-empty' />}


        </div>
    )
}

// to get the users we will have to go inside the user list 
// and we will have to create a new state const users and also
// set users and default value is an empty array and then we use a useEffect hook

const UserList = ({ setSelectedUsers }) => {

    // client gets query
    const { client } = useChatContext();

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);

    const [listEmpty, setListEmpty] = useState(false);

    const [error, setError] = useState(false);

    // useEffect hook will be called when something changes,
    // in this case when filters change - because sometimes we want users for direct messages 
    // and some times we want users only for channel messages

    useEffect(() => {

        // effect
        const getUsers = async () => {
            // get users
            // check if we are currently loading something in that case we want to go out of the func
            // loading will be a state field

            if (loading) return; // we dont want to get the users if we are loading something

            // when we are starting to get users we want to enable loading
            setLoading(true);

            try {
                // query users from useChatContext (queryUsers is StreamChat method)
                const response = await client.queryUsers(
                    // specifying parameters as object
                    { id: { $ne: client.userID } }, // we are excluding the client userId wich means we will search for other userIds except that of the current user
                    { id: 1 }, // sort - lastactive is -1 and created at is 1
                    { limit: 8 } // limit to 8 users
                );

                if (response.users.length) {
                    setUsers(response.users)
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                setError(true)
            }

            setLoading(false);
        }

        // if we are connected
        if (client) {
            getUsers()
        }
    }, [])

    if (error) {
        return (
            <ListContainer>
                <div className='user-list__message'>
                    Error Loading, Please refresh and try again.
                </div>
            </ListContainer>
        )
    }
    
    if (listEmpty) {
        return (
            <ListContainer>
                <div className='user-list__message'>
                    No Users found.
                </div>
            </ListContainer>
        )
    }

    return (
        <div>
            <ListContainer>
                {loading ? <div className='user-list__message'>
                    Loading Users...
                </div> : (
                    users?.map((user, i) => (
                        <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
                    ))
                )}
            </ListContainer>
        </div>
    )
}

export default UserList;
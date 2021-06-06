import React from 'react';

function ConversationList(props){
    let list = <div className="no-content-message">no conversations</div>;
    if (props.conversations && props.conversations.length!==0) {
        list = props.conversations.map(c => {
            let userchatingwith=c.users[0]._id===props.myId?c.users[1]:c.users[0]
            return <div className='channel-item' onClick={() => {
                props.onSelectChannel(c._id);
            }}>
                <img src={userchatingwith.photo} alt=""></img>
                <span>{userchatingwith.fname+userchatingwith.lname}</span>
            </div>
        });
    }
    return (
        <div className='channel-list'>
            {list}
        </div>);

}

export default ConversationList
import React from 'react';
import styled from 'styled-components';
import PlaceHolderProfilePic from '../../images/placeholder-profile-picture.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { changeActiveChat } from '../../slices/appSlice';

function formatTimestamp(timestamp: any): string {
	if (timestamp === undefined)
		return '';

    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

    // Get the current date
    const currentDate = new Date();
    
    // Calculate the time difference in milliseconds
    const timeDifference = currentDate.getTime() - date.getTime();

    // Convert the time difference to seconds
    const seconds = Math.floor(timeDifference / 1000);

    // Define time intervals in seconds
    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const month = day * 30;
    const year = day * 365;

    // Format the timestamp based on the time difference
    if (seconds < minute) {
        return 'Just now';
    } else if (seconds < hour) {
        const minutes = Math.floor(seconds / minute);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (seconds < day) {
        const hours = Math.floor(seconds / hour);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (seconds < week) {
        const days = Math.floor(seconds / day);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else if (seconds < month) {
        const weeks = Math.floor(seconds / week);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else if (seconds < year) {
        const months = Math.floor(seconds / month);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
        const years = Math.floor(seconds / year);
        return `${years} year${years > 1 ? 's' : ''} ago`;
    }
}

export default function ChatBox(props:any) : React.ReactElement {
	const dispatch = useDispatch();
	const chat = useSelector((state:any) => state.app.activeChat);
	const messages = useSelector((state:any) => state.userMessages.messages);
	const currentUser = useSelector((state:any) => state.userDetails);
	
	
	
	function getLastMessageDate(contactId:string) : string {
		if (messages.length === 1)
			return '';
		
		const message = messages.filter( (message:any) => {
			
			if (message !== undefined && message.senderId !== undefined && (message.senderId === currentUser.id && message.receiverId === contactId
							|| message.senderId === contactId && message.receiverId === currentUser.id ))
				return message;
		})

		if (message[message.length - 1] === undefined)
			return '';
		
		return formatTimestamp(message[message.length - 1].timestamp);
	}


	function getLastMessage(contactId:string) : Array<any> {
		if (messages.length === 1)
			return ['', false];

		const message = messages.filter( (message:any) => {
			
			if (message !== undefined && message.senderId !== undefined && (message.senderId === currentUser.id && message.receiverId === contactId
							|| message.senderId === contactId && message.receiverId === currentUser.id ))
				return message;
		})

		if (message[message.length - 1] === undefined)
			return ['', false];

		if (message[message.length - 1].senderId === currentUser.id)
			return ['You: ' + message[message.length - 1].message, true];
		else
			return [message[message.length - 1].message, message[message.length - 1].seen];
	}
	
	const [lastMessage, seen] = getLastMessage(props.contact.id);
	console.log(lastMessage);
	return (
		<Box onClick={ () => {
			dispatch(changeActiveChat(props.contact));
		}}
		
			active = { chat ? chat.id === props.contact.id : false }
			seen = { !seen }
		>

			<ImgWrapper>
				<img src={props.profile_image !== '' ? `http://localhost:5000/static/profile-images/${props.profile_image}?dummy1 = ${(new Date()).toString()}` : PlaceHolderProfilePic } alt="User profile" />
			</ImgWrapper>
			
			<BoxContent>
				<BoxContentInfo>
					<h3>{ props.phoneNumber } </h3>
					<Message>{ lastMessage.length < 20 ? lastMessage : lastMessage.slice(0, 20) + '...' }</Message>
				</BoxContentInfo>


				<Date_>
					<div>{ getLastMessageDate(props.contact.id) }</div>
				</Date_>
			</BoxContent>
		</Box>
	);
}

const Box = styled.div<{ active : boolean, seen : boolean }>`
	width: 100%;
	height: 10vh;
	padding: 10px;

	display: flex;
	align-items: center;
	color: ${p => p.seen ? 'green' : 'white' } ;
	background-color: ${ p => p.active ? '#1d2a32' : '#111b21' };
	cursor: pointer;
	& h3 {
		color: white;
	}

	&:hover {
		background-color: #1d2a32;
	}

	transition: 0.3s all ease-in;
	/* border-bottom: 1px solid grey; */
`;

const BoxContent = styled.div`
	flex: 1;
	display: flex;
	justify-content: space-between;
`;

const Message = styled.p`

`;

const ImgWrapper = styled.div`
	height: 100%;
	img {
		height: 100%;
		aspect-ratio: 1 / 1;
		border-radius: 50%;
	}
`;

const BoxContentInfo = styled.div`
	padding-left: 5px;
`;

const Date_ = styled.div`

`;


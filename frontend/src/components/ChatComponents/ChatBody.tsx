import React, { useMemo, useRef, useEffect } from "react";
import styled from "styled-components";
import BackgroundChat from '../../images/background-chat.jpg';
import Message from "./Message";
import { useSelector, useDispatch } from "react-redux";

import Time from "./Time";
import axios from "axios";
import { changeMessages } from "../../slices/userMessages";


export function getHour(timestamp:any)
{
	if (timestamp === undefined)
		return ['', '', ''];

	const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);


	let hour:number|string = date.getHours();
	let minute:number|string = date.getMinutes();
	const ampm = hour >= 12 ? 'PM' : 'AM';

	hour = hour % 12 || 12;

	if (hour < 10)
		hour = '0' + hour;
	
	if (minute < 10)
		minute = '0' + minute;

	return [ hour, minute, ampm ];
}

export function getDate(timestamp: any): string {
	// Assuming timestamp has properties 'seconds' and 'nanoseconds'
	if (timestamp === undefined)
		return '';

	const seconds = timestamp.seconds || 0;
	const nanoseconds = timestamp.nanoseconds || 0;
  
	// Combine seconds and nanoseconds to get milliseconds
	const milliseconds = seconds * 1000 + nanoseconds / 1e6;
  
	// Create a Date object
	const dateObject = new Date(milliseconds);
  
	// Extract day, month, and year
	const day = dateObject.getDate().toString().padStart(2, '0');
	const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Note: Months are 0-indexed
	const year = dateObject.getFullYear();
  
	// Formatted date string
	const formattedDate = `${day}/${month}/${year}`;
  
	return formattedDate;
}

// ... (previous imports)

export default function ChatBody(props: any): React.ReactElement {
	const messages = useSelector((state: any) => state.userMessages.messages);
	const partnerUserId = useSelector((state: any) => state.app.activeChat.id);
	const currentUserId = useSelector((state: any) => state.userDetails.id);
	const chat = useSelector((state:any) => state.app.activeChat);
	const dispatch = useDispatch();

	let lastDisplayedDate: string | null = null;

	function setSeenMessages() : void {
		let messagesToUpdateSeen:any = [];
		let messagesOther:any = [];
		
		if (messages.length > 0 && partnerUserId && currentUserId)
		{
			
			messagesToUpdateSeen = messages.filter((message:any) => {
				
				console.log(message.seen)
				if (message.seen === false && message.senderId === partnerUserId)
					return true;
				else
					messagesOther.push(message);
				
			});

			
			
			console.log('messages to update seen', messagesToUpdateSeen);

			let data = {
				token: localStorage.getItem('session-token'),
				messages : messagesToUpdateSeen
			};

			if (messagesToUpdateSeen.length > 0)
			{
				axios({
					url: "http://localhost:5000/change-seen-status",
					method: "POST",
					data
				})
				.then((response) => {
		
					let temp = messagesToUpdateSeen.map((message:any) => {
						return {
							...message,
							seen : true
						}
					});
					
					// let temp2 = messages.filter((messages:any))
					let newArr = temp.concat(messagesOther);

					newArr = newArr.toSorted((a:any, b:any) : number => {
						if (a === undefined || a.timestamp === undefined )
							return 1;
						else if (b === undefined ||  b.timestamp === undefined)
							return -1;
		
						if (a.timestamp.seconds > b.timestamp.seconds)
							return 1;
						else if (a.timestamp.seconds === b.timestamp.seconds)
						{
							if (a.timestamp.nanoseconds > b.timestamp.nanoseconds)
								return 1;
							else if (a.timestamp.nanoseconds === b.timestamp.nanoseconds)
								return 0;
							else
								return -1;
						}
						else
							return -1;
					})
					dispatch(changeMessages(newArr));
;		
						
		
		
				})
				.catch((err) => {
		
				});
			}
		}
	}

	useEffect( () => {

		
		setSeenMessages();
		
		
		const chatBody = document.querySelector('#chat-body');

		if (chatBody) {
			chatBody.scrollTop = chatBody.scrollHeight;
		}
		
	}, [messages, chat]);


	const memoizedMessages = useMemo(() => {
	  //setSeenMessages();
	  return messages.map((message: any, index: number) => {
		//console.log('here: ', message);

		const [hour, minutes, ampm] = getHour(message.timestamp);
		let timeComponent = null;

		
		if (message.senderId === currentUserId && message.receiverId === partnerUserId) {
			const currentDate = getDate(message.timestamp);
  
			
	
			if (lastDisplayedDate !== currentDate) {
			
				timeComponent = <Time date={currentDate} />;
				
				lastDisplayedDate = currentDate;
			}
  
		  return (
			<>
			  {timeComponent}
				<Message 
			  		time={`${hour}:${minutes}${ampm}`} 
					direction='right' 
					status={ message.seen }
					id = { message.id }
				>
					{message.message}
				</Message>
			</>
		  );
		} else if (message.senderId === partnerUserId && message.receiverId === currentUserId) {
			const currentDate = getDate(message.timestamp);
	
			if (lastDisplayedDate !== currentDate) {
			
				timeComponent = <Time date={currentDate} />;
				
				lastDisplayedDate = currentDate;
			}
		  return (
			<>
			  {timeComponent}
			  	<Message 
			  		time={`${hour}:${minutes}${ampm}`} 
					direction='left' 
					status={ message.seen }
					id = { message.id }
				>
					{message.message}
			  </Message>
			</>
		  );
		}
  
	  });
	}, [messages, partnerUserId, currentUserId]);
  
	return (
	  <ChatBodyStyled id="chat-body">
		{memoizedMessages}
	  </ChatBodyStyled>
	);
  }
  
  // ... (previous styled components)
  

const ChatBodyStyled = styled.div`
	height: 80%;
	width: 100%;
	padding: 15px 5px;
	background-image: url('${BackgroundChat}');
	background-repeat: repeat;
	background-size: contain;
	overflow-y: auto;
`;


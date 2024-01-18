import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import BackgroundChat from '../images/background-chat.jpg';
import PlaceHolderProfilePic from '../images/placeholder-profile-picture.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faEllipsisVertical, faSearch, faFaceSmileBeam, faPlus, faMicrophone } from '@fortawesome/free-solid-svg-icons';
import InputBar from './InputBar';
import { IconWrapper } from './SearchBar';
import { useDispatch, useSelector } from 'react-redux';
import { changeSideBarChatStatus } from '../slices/appSlice';
import WrapDropDown from './WrapDropDown';
import axios from 'axios';
import ChatHeader from './ChatComponents/ChatHeader';
import ChatFooter from './ChatComponents/ChatFooter';
import ChatBody from './ChatComponents/ChatBody';

export default function Chat() : React.ReactElement {
	const dispatch = useDispatch();
	const messages = useSelector((state: any) => state.userMessages.messages);
	const chat = useSelector((state:any) => state.app.activeChat);
	const currentUserId = useSelector((state: any) => state.userDetails.id);
	// const socket = useSelector((state:any) => state.app.socket);
	const [online, setOnline]= useState<string>('');
	// const active = useSelector((state:any) => state.app.sideBarChat)

	useEffect(() => {
		function isOnline(id:string) : void {		
			let data = {
				token : localStorage.getItem('session-token'),
				userId : id
			};
	
			axios({
				url: "http://localhost:5000/is-online",
				method: "POST", 
				data
			}).then((response) => {
				
				setOnline(response.data ? 'Online' : 'Offline');
			}).catch(() => {

			})
		}	

		function setSeenMessages() : void {
			console.log('Chat component: ');

			let messagesToUpdateSeen:any = [];

			
			if (messages.length > 0 && chat)
			{
				messages.forEach((message:any) => {
					if (message.seen === false && message.senderId === chat.id && message.receiverId === currentUserId)
						messagesToUpdateSeen.push(message);
					
				});

				
			}

			console.log(messagesToUpdateSeen);

			let data = {
				token: localStorage.getItem('session-token'),
				messages : messagesToUpdateSeen
			};

			axios({
				url: "http://localhost:5000/change-seen-status",
				method: "POST",
				data
			  })
			  .then((response) => {

			  })
			  .catch((err) => {

			  });
		}


		setOnline('Checking status...');
		
		if (chat)
			isOnline(chat.id);

		let ref = setInterval( () => {
			if (chat)
				isOnline(chat.id);
		
		
		}, 60000); // 1 minute

		
		//setSeenMessages();
		
		
		
		

		return function cleanup() {
			clearInterval(ref);
			
		};
	}, [chat]);
	
	return (
		chat && (
			<ChatStyled>
				<ChatHeader 
					profile_image_name = { chat?.profile_image_name }
					name = { chat?.name }
					phoneNumber = { chat.phoneNumber}
					online = { online }
				/>
				
				<ChatBody />
				
				<ChatFooter />
			</ChatStyled> 
		)
	);
}

const ChatStyled = styled.div`
	height: 101%;
	width: 70%;
	@media  (max-width: 900px) {
		width: 100%;
	}


`;

// @media  (max-width: 900px) {
// 	width: 100%;
// 	display: ${p => !p.active ? 'block' : 'none'}; 
// }


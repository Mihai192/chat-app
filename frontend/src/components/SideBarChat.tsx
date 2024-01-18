import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faX } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { changeSideBarChatStatus } from "../slices/appSlice";
import SearchBar from "./SearchBar";
import Message from "./ChatComponents/Message";

import { getHour } from "./ChatComponents/ChatBody";
import Time from "./ChatComponents/Time";

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

export default function SideBarChat(): React.ReactElement {
	const dispatch = useDispatch();
	const active = useSelector((state: any) => state.app.sideBarChat)
	const messages 		= useSelector((state:any) => state.userMessages.messages);
	const partnerUser = useSelector((state:any) => state.app.activeChat);
	const currentUser = useSelector((state:any) => state.userDetails);
	let [messageId, changeMessageId] = useState(null);
	const [input, changeInput] = useState<string>('');
	let chatBody:any;
	let partnerUserId:any;
	let currentUserId:any;


	console.log(input);

	useEffect( () => {
		
		if (active === false && messageId !== null)
		{
			const targetElement = document.getElementById(messageId);
			if (targetElement) {
				targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}, [active]);

	if (partnerUser)
		partnerUserId = partnerUser.id;

	if (currentUser)
		currentUserId = currentUser.id;

	let lastDisplayedDate: string | null = null;
	return (
		<SideBarStyled value={active}>

			<CloseSideBar>
				<Icon icon={faX} size="2x" onClick={() => {
					dispatch(changeSideBarChatStatus(false));
				}} />
			</CloseSideBar>
			

			<SearchBar 
				placeHolder = "Cauta un mesaj in conversatie..." 
				onKeyDown = { (input:string) => {
					changeInput(input);
				}}	
			/>

			<Messages>
				{
					messages && partnerUserId && currentUserId && messages.map((message:any) => {	
						let [hour, minutes, amp] = getHour(message.timestamp);
						let timeComponent = null;
						if (message.senderId === currentUserId && message.receiverId === partnerUserId && message.message.includes(input) && input !== '')
						{
							
							const currentDate = getDate(message.timestamp);
	
							if (lastDisplayedDate !== currentDate) {
							
								timeComponent = <Time date={currentDate} />;
								
								lastDisplayedDate = currentDate;
							}

							return (
								
								<>
			  					{timeComponent}
									<Message
										time={`${hour}:${minutes}${amp}`}  
										direction='right'
										status = { true }
										callback = { () => {
											dispatch(changeSideBarChatStatus(false));
											changeInput('');
											changeMessageId(message.id);
											
										}}
									> 
										{ message.message } 
									</Message>
								</>
							);
						}
						else if (message.senderId === partnerUserId && message.receiverId === currentUserId &&  message.message.includes(input)  && input !== '')
						{
							const currentDate = getDate(message.timestamp);
	
							if (lastDisplayedDate !== currentDate) {
							
								timeComponent = <Time date={currentDate} />;
								
								lastDisplayedDate = currentDate;
							}

							return (
								<>
									{timeComponent}
									<Message
										time={`${hour}:${minutes}${amp}`} 
										direction='left'
										status = { true }
										callback = { () => {
											dispatch(changeSideBarChatStatus(false));
											changeInput('');
											changeMessageId(message.id);
											
										}}
									> 
										{ message.message } 
									</Message>
								</>
							);
						}
					}) 
				}
			</Messages>
		</SideBarStyled>
	);
}

const Icon = styled(FontAwesomeIcon)`
	
	color: white;
	padding: 20px;
	cursor: pointer;
`;

const Heading = styled.h1`
	padding: 10px;
	color: white;
`;	

const SideBarStyled = styled.div<{ value: boolean }>`
	width: ${p => { if (p.value) return "30%"; else return "0%" }};
	height: 101%;
	
	overflow: auto;
	background-color: #111b21;

	transition: 0.4s all ease;

	
	

	@media  (max-width: 900px) {
		width:  ${p => { if (p.value) return "100%"; else return "0%" }};
		/* flex: 1; */
		position: fixed;
		top: 0;
		left: 0;

		
	}
`;

const CloseSideBar = styled.div``;


const Messages = styled.div`
	margin-top: 10px;
	overflow-y: auto;
	height: 100%;

`;


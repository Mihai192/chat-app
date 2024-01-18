import React from "react";

import styled from "styled-components";
import { faFaceSmileBeam, faPlus, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InputBar from "../InputBar";
import WrapDropDown from "../WrapDropDown";
import { IconWrapper } from "../SearchBar";
import axios from "axios";
import { useSelector } from "react-redux";

export default function ChatFooter() : React.ReactElement {
	const receiverId = useSelector((state:any) => state.app.activeChat.id);
	
	return (
		<ChatFooterStyled>
			<Icons>
				<Icon icon={faFaceSmileBeam}  />
				
				
				<WrapDropDown icon={faPlus}/>
			</Icons>

			<InputBar callback = { (input:string) => {
				let data = {
					token : localStorage.getItem('session-token'),
					receiverId : receiverId,
					message : input,
					timestamp : new Date()
				};

				axios({
					url: "http://localhost:5000/add-message",
					method: "POST", 
					data
				}).then(() => {

				})
				.catch(() => {

				});
			}}/>


			<IconWrapper>
				<Icon icon={faMicrophone} />
			</IconWrapper>
		</ChatFooterStyled>
	);
}

const ChatFooterStyled = styled.div`
	height: 10%;
	width: 100%;
	background-color: #202c33;
	display: flex;
	justify-content: space-around;
	svg {
		padding: 0px 20px;
	}
`;



const Icons = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	/* width: 15%; */
	height: 100%;
`;

const Icon = styled(FontAwesomeIcon)`
	color: white;

	padding-right: 20px;
	
	cursor: pointer;
	display: flex;

`;


import React from 'react';
import styled from 'styled-components';
import ChatBox from './ChatsContainerComponents/ChatBox';
import { useSelector } from 'react-redux';
import Spinner from '../images/spinner2.svg';

export default function ChatsContainer({ contactsList, filteredContacts }:any) {
	const contacts = contactsList;

	return (
		<ChatsContainerStyled>
			{
				contacts === null || filteredContacts === null ? <SpinnerWrapper> <img src={Spinner} alt="" /> </SpinnerWrapper>
					:
					(
						filteredContacts.length === 0 ?
							(
								filteredContacts.length === 0 && contacts.length === 0 ?
									<Empty>You don't have contacts at the moment. <br /> Start adding people.</Empty>
								:
									<Empty>¯\_(ツ)_/¯</Empty>
							)
							:
							(
								filteredContacts.map((contact:any, index:number) => {

								return (
										<ChatBox 
											name = { contact.name }
											profile_image = { contact.profile_image_name }
											phoneNumber = { contact.phoneNumber }
											index = { index }

											
											contact = { contact }
										/>
									);
								})
							)
					)
			}

			<Footer>
				<p>Created with &#10084; by michael </p>

				<Credits>
					<a target="_blank" href="https://icons8.com/icon/16712/whatsapp">WhatsApp</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
				</Credits>
			</Footer>
		</ChatsContainerStyled>	
	);
}

const ChatsContainerStyled = styled.div`
	height: 81%;
	width: 100%;
	background-color: #202c33;
	overflow: auto;
`;

const SpinnerWrapper = styled.div`
	display: flex;

	justify-content: center;

	img {
		width: 100px;
		height: 100px;
	}
`;



const Credits = styled.div`

`;
const Footer = styled.div`
	
	color: white;
	width: 100%;
	height: 10vh;
	padding: 10px;

	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	
	background-color: #111b21;
	p {
		text-align: center;
	}
`;

const Empty = styled.div`

	color: white;
	padding: 20px;
`;


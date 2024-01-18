import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ChatsContainer from './ChatsContainter';
import SearchBar from './SearchBar';


import SideBarSettings from './SideBarSettings';


import AddContact from './AddContact';
import { useDispatch, useSelector } from "react-redux";
import ProfileEdit from './ProfileEdit';
import RequestsList from './RequestsList';
import SettingsSection from './ChatsPanelComponents/SettingsSection';


function getSideBarBody(sideBarType:string) : React.ReactElement {
	switch(sideBarType)
	{
		case 'profile-edit':
			return <ProfileEdit />
		case 'add-contact':
			return <AddContact />
		case 'requests-list':
			return <RequestsList />
		default:
			return <></>;
	}
}

function getSideBarTitle(sideBarType:string) : string {
	switch(sideBarType)
	{
		case 'profile-edit':
			return 'Profile';
		case 'add-contact':
			return 'Add new contact';
		case 'requests-list':
			return 'Requests list';
		default:
			return '';
	}
}

export default function ChatsPanel() {
	const sideBarType:string = useSelector((state: any) => state.app.sideBarSettingsType);	
	const contacts:Array<any> = useSelector((state:any) => state.userContacts.contacts);
	const [filteredContacts, changeFilteredContacts] = useState<Array<any>>(contacts);
	const chat = useSelector((state:any) => state.app.activeChat);
	useEffect(() => {
		changeFilteredContacts(contacts);
	}, [contacts]);
	
	return ( 
		<ChatsPanelStyled active = { chat ? true : false }>
			
			<SettingsSection />
			
			<SearchBar 
				placeHolder = {'Search for a conversation...'} 

				onChange = { (input:any) => {
					
					console.log(input);
					let newContacts = contacts.filter((contact) => {
						if (contact.phoneNumber.startsWith(input))
							return contact.phoneNumber;
					});

					if (input === '')
						changeFilteredContacts(contacts);
					else
						changeFilteredContacts(newContacts);
				}}
			/>

			<ChatsContainer contactsList = { contacts }  filteredContacts = { filteredContacts } />
		
			<SideBarSettings header={ getSideBarTitle(sideBarType) }>
				{ getSideBarBody(sideBarType) }
			</SideBarSettings> 

		</ChatsPanelStyled>	
		
	);
}


const ChatsPanelStyled = styled.div<{ active : boolean }>`
	height: 100%;
	width: 30%;
	position: relative;
	/* overflow: hidden; */



	@media  (max-width: 900px) {
		width: 100%;
		display: ${p => !p.active ? 'block' : 'none'}; 
	}
`;



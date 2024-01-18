import React, { useEffect } from 'react';
import styled from 'styled-components';
import ChatsPanel from '../components/ChatsPanel';
import Chat from '../components/Chat';
import SideBarChat from '../components/SideBarChat'; 
import useEventListener from '@use-it/event-listener';
import { useDispatch, useSelector } from 'react-redux';
import { changeName, changeDescription, changeProfileImageName, changeProfileImage, changePhoneNumber } from '../slices/userDetailsSlice';
import placeHolderImage from '../images/placeholder-profile-picture.jpg';
import { io } from 'socket.io-client';
import axios from 'axios';
import { changeRequests } from '../slices/requestsListSlice';
import { changeContacts } from '../slices/userContactsSlice';
// import { changeSocket } from '../slices/appSlice';
import { changeMessages } from '../slices/userMessages';
import { changeId } from '../slices/userDetailsSlice';

export default function AppPage() {
	const dispatch = useDispatch()
	
	useEffect(() => {
		let data = {
			token : localStorage.getItem('session-token')
		}
		
		const socket = io('http://localhost:5000');
		
		//dispatch(changeSocket(socket));

		socket.on('connect', () => {
			
			socket.emit('token', data.token);
		});

		socket.on('requests', (arr) => {
			


			// arr.forEach((userObj:any) => {

				
			// 	console.log(userObj);
			// });
			console.log('executing this...')
			console.log(arr);
			dispatch(changeRequests(arr))
		});

		socket.on('connect_error', ()=>{
			setTimeout(() => socket.connect(), 5000)
		})


		socket.on('contacts', (arr) => {
			
			console.log('Sunt aici:', arr);
			dispatch(changeContacts(arr));
		});

		socket.on('messages', (arr) => {
			
			arr = arr.toSorted((a:any, b:any) : number => {
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
			
			dispatch(changeMessages(arr));
		});

		axios({
			url: "http://localhost:5000/get-contacts",
			method: "POST", 
			data
		}).then((data) => {
			if (data.status === 404)
				return Promise.reject('');
			dispatch(changeContacts(data.data));
		})
		.catch(() => {
			dispatch(changeContacts([]));
		});

		axios({
			url: "http://localhost:5000/user-details",
			method: "POST", 
			data
		}).then(async (value) => {
			let data = value.data;
			console.log('user details', data);
			dispatch(changeId(data.id));
			dispatch(changeName(data.name));
			dispatch(changeDescription(data.description));
			dispatch(changePhoneNumber(data.phoneNumber));
			await dispatch(changeProfileImageName(data.profile_image_name));

			if (data.profile_image_name)
				dispatch(changeProfileImage('http://localhost:5000/static/profile-images/' + data.profile_image_name))
			else
				dispatch(changeProfileImage(placeHolderImage));

				// data.profile_image_name
			
		}).catch((err) => {
			console.log(err);
		});

        const handleContextmenu = (e:any) => {
            e.preventDefault()
        }
		
        document.addEventListener('contextmenu', handleContextmenu)
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
	}, [])

	useEventListener('contextmenu', (event) => {
		console.log('right click');
	});

	return (
		<AppContainer>

			<App>
				<ChatsPanel />

				<Chat />

				<SideBarChat />
			</App>

		</AppContainer>
	);
}


const AppContainer = styled.div`
	/* width: 100vw;
	height: 100vh;
	display: flex;
	justify-content: center;
	align-items: center; */
	background-color: #222e35;
`;

const App = styled.div`
	width: 100vw;
	height: 100vh;

	display: flex;
	background-color: #222e35;
	transition: 0.4s all ease;
	
	@media  (max-width: 900px) {
		
		/* flex: 1; */
		display: block;
	}
`;




import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import placeHolderImage from '../../images/placeholder-profile-picture.jpg';
import { useDispatch, useSelector } from 'react-redux';
import { changeContacts } from '../../slices/userContactsSlice';


function formatTimestamp(timestamp: any): string {
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


export default function RequestContact(props:any) : React.ReactElement {
	const dispatch = useDispatch();
	const contacts = useSelector((state: any) => state.userContacts.contacts);
	return (
		<Request>
			<Wrap>
				<ImgWrapper>
					<Img 
						src={ 
							props.profile_image_name !== '' 
								? `http://localhost:5000/static/profile-images/${props.profile_image_name}?dummy1 = ${(new Date()).toString()}` 
								: placeHolderImage 
							} 
						alt="" 
					/>
				</ImgWrapper>		
				<Info>
					<Name>{props.name !== '' ? props.name : props.phoneNumber }</Name>
					<Description>{props.description !== '' ? props.description : 'This user doesn\'t have a description set'}</Description>
				
					<div>{ formatTimestamp(props.timestamp) }</div>
				</Info>	
			</Wrap>
			<Buttons>
				<ConfirmButton onClick={ () => {
					
					let data = {
						token : localStorage.getItem('session-token'),
						id : props.id
					};

					axios({
						url : 'http://localhost:5000/confirm-request',
						method : 'POST',
						data
					})
					.then((response) => {
						console.log('request added sucessfully: ', response);
						let newContacts = [...contacts]; // shallow copy since we don't modify the values
						newContacts.push(response.data);

						dispatch(changeContacts(newContacts));
					})
					.catch((err) => {

					});


				}}>Confirm</ConfirmButton>
				<RemoveButton onClick={ () => {
					console.log('rejecting....');






					
				}}>Remove</RemoveButton>
			</Buttons>
		</Request>
	);
}


const ImgWrapper = styled.div`
	width: 50px;
	height: 50px;
`;

const Wrap = styled.div`
	display: flex;
	gap: 10px;
`;

const Button = styled.button`
	padding: 4px 9px;
	outline: none;
	border: none;
	cursor: pointer;
	border-radius: 5px;
`;


const ConfirmButton = styled(Button)`
	color: white;
	background-color: green;
`

const RemoveButton = styled(Button)`
	color: white;
	background-color: red;
`

const Request = styled.div`
	display: flex;
	justify-content: space-between;
	
`;

const Info = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;

`;
const Img =  styled.img`
	width: 100%;
	height: 100%;
	border-radius: 50%;
`;

const UserInfo = styled.div`
	
`;

const Name = styled(UserInfo)`

`

const Description = styled(UserInfo)`

`;


const Buttons = styled.div`


	display: flex;
	align-items: center;
	gap: 10px;
	
`;


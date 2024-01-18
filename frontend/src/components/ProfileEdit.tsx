import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import InputSection from './ProfileEditComponents/InputSection';
import ImgWrapperInput from './ProfileEditComponents/ImgWrapperInput';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { changeName, changeDescription } from '../slices/userDetailsSlice';

export default function ProfileEdit() : React.ReactElement {
	const dispatch = useDispatch();
	const name = useSelector((state: any) => state.userDetails.name);
	const description = useSelector((state:any) => state.userDetails.description);
	
	const phoneNumber = useSelector((state:any) => state.userDetails.phoneNumber);


	return (
		<ProfileEditStyle>
			<ImgWrapperInput />


			<PhoneNumberSection>

				<Label>Your phone number</Label>
				<PhoneNumber>{phoneNumber ? phoneNumber : ''}</PhoneNumber>
			</PhoneNumberSection>

			<InputSection 
				maxLength= {20}
				labelFor = "name"
				labelName = "Your name"
				value = { name }
				inputType = {1} 

				callback = {
					(name:string) => {
						let data = {
							name,
							token : localStorage.getItem('session-token')
						};
	
						axios({
							// TODO: env variable for DEV url and PROD url
							url: "http://localhost:5000/user-details-edit",
							method: "POST", 
							data
						})
						.then(() => {

							
							dispatch(changeName(data.name));
							

						})
						.catch(() => {});
					}
				}
			/>
					
			<Paragraph>This is not your username or your pin. This name will be visible to your contacts.</Paragraph>
			
			<InputSection 
				maxLength= {40}
				labelFor = "description"
				labelName = "Your Description"
				value = {description}
				inputType = {0}
				callback = {
					(description:string) => {
						let data = {
							description,
							token : localStorage.getItem('session-token'),
						};
	
						axios({
							// TODO: env variable for DEV url and PROD url
							url: "http://localhost:5000/user-details-edit",
							method: "POST", 
							data
						})
						.then(() => {
							dispatch(changeDescription(data.description))
						})
						.catch(() => {});
					}
				}
			/>	
		</ProfileEditStyle>
	)
}

const PhoneNumberSection = styled.div`
	margin-bottom: 20px;
	padding: 10px;
`

const ProfileEditStyle = styled.div`
	color: white;

	label {
		color: green;
		display: block;
	}
`;

const Label = styled.div`
	margin-bottom: 20px;
	font-size: 1.3rem;
	color: green;
`;

const PhoneNumber = styled.div`
	font-size: 1.3rem;
`;

const Paragraph = styled.div`
	padding: 10px;
`;


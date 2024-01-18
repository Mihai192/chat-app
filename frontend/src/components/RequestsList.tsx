import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

import Spinner from '../images/spinner2.svg';
import RequestContact from './RequestsListComponents/RequestContact';



export default function RequestsList() : React.ReactElement {
	const requests = useSelector((state: any) => state.requestsList.requests);

	console.log(requests);
	return (
		<RequestsListStyled>
			{ 
				requests === null ? <SpinnerWrapper> <img src={Spinner} alt="" /> </SpinnerWrapper>
				:
				(
					requests.length === 0 
					?
					'There are not contact requests at the moment...'
					:
					(
						requests.map((request:any) => {
							return (
								// Add key 
								<RequestContact 
									name = { request.name }
									description = { request.description }
									profile_image_name = { request.profile_image_name }
									timestamp = { request.timestamp }
									phoneNumber = { request.phoneNumber }
									id = { request.id }
								/>
							)
						})
					)
				)
			}
		</RequestsListStyled>
	)
}


const SpinnerWrapper = styled.div`
	display: flex;

	justify-content: center;

	img {
		width: 100px;
		height: 100px;
	}
`;



const RequestsListStyled = styled.div`
	color: white;
	padding: 20px;
`;
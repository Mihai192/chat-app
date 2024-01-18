import React, { useState } from 'react';
import styled from 'styled-components';
import SearchBar from './SearchBar';
import Spinner from '../images/spinner2.svg';

import axios from 'axios';

export default function AddContact() : React.ReactElement {
	const [response, changeResponse] = useState<number|string>(0);

	const onKeyDown = (input:any) => {
		
		let data = {
			token : localStorage.getItem('session-token'),
			phoneNumber : input
		};
		changeResponse(1);
		axios({
			// TODO: env variable for DEV url and PROD url
			url: "http://localhost:5000/add-contact",
			method: "POST", 
			data
		})
		.then((response) => {
			if (response.data && response.data.message)
			{
				console.log(response.data);
				changeResponse(response.data.message);
			}
			else
				changeResponse('Couldn\'t send the request... Try again later... ');
			
			setTimeout(() => {
				changeResponse(0);
			}, 4000)
		})
		.catch((error) => {
			if (error.response.data && error.response.data.message)
				changeResponse(error.response.data.message);
			else
				changeResponse('Couldn\'t send the request... Try again later... ');
			setTimeout(() => {
				changeResponse(0);
			}, 4000)
		});
		
	}

	return (
		<>
			<SearchBar 
				placeHolder='Add a new contact...'
				onKeyDown = { (input:any) => {
					onKeyDown(input);
				}}
			/>

			{
			
				response === 0 ?  // initial
						'' :
					response === 1 // waiting
						?
						<SpinnerWrapper>
							<img src={Spinner} alt="" />
						</SpinnerWrapper>
				  		: // response
						<Response>
							{ response }
						</Response>
			}
			
		</>
	)
}

const InputWrapper = styled.div`
	padding: 20px;
	display: flex;
	button {
		padding: 10px;
		cursor: pointer;
	}

	input {
		display: inline-block;
		width: 100%;
		padding: 5px 10px;
		flex: 1;
		outline: none;
	}
`;

const SpinnerWrapper = styled.div`
	display: flex;

	justify-content: center;

	img {
		width: 100px;
		height: 100px;
	}
`;


const Input = styled.input`
	
	
`;

const Heading = styled.h1`
	padding: 10px;
	color: white;
`;

const Response = styled.div`
	padding: 20px;
	color: white;
`;
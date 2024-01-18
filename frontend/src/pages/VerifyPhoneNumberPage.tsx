import React, { useState, useReducer } from 'react';
import { Heading1 } from './AgreementPage';
import { Input, Paragraph } from './SignUpPage';
import { shake } from '../animations/shake';
import { Button, InputsWrapper } from './LoadingPage';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { appPage } from '../slices/pageSlice';

export default function VerifyPhoneNumberPage(props:any) {
	const [inputError, changeInputError] = useState<boolean>(false);
	const [text, setText] = useState<string>('');
	const [_, forceUpdate] = useReducer(x => x + 1, 0);
	const dispatch = useDispatch();
	
	return (
		<div>
			<Heading1>A verification code was sent to your phone</Heading1>
			<Paragraph>Check messages</Paragraph>
			<InputsWrapper>
				<Input 
					variants={ inputError ? shake : '' }
					value = { text }
					
					initial='hidden'
					animate='animate'

					type="number" 
					style={{ textAlign : 'center', fontSize: '2rem' }}  
					onChange = { (e) => setText(e.target.value) }
				/>
				<br />
				<Button onClick={() => {
					let data = {
						code : text,
						token : localStorage.getItem('phoneNumberAuthToken'),
						type : props.type
					};

					axios({
						url: "http://localhost:5000/verify-code",
						method: "POST", 
						data
					})
					.then((response) => { 
						if (response.status === 404)
							return Promise.reject();
						
						localStorage.removeItem('phoneNumberAuthToken');
						localStorage.removeItem('authType');
						
						

						localStorage.setItem('session-token', response.data['session_token']);
						dispatch(appPage());
					})
					.catch((error) => {
						changeInputError(true);
						setTimeout(() => changeInputError(false), 500);
						forceUpdate();
					})
				}}>Enter</Button>
			</InputsWrapper>
		</div>
	);
}


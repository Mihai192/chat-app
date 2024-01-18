
import React from 'react';
import { useState, useReducer } from 'react';

import { Button, InputsWrapper } from './LoadingPage';
import { Heading1 } from './AgreementPage';
import { Input, Paragraph } from './SignUpPage';
import { useDispatch } from 'react-redux';
import { verifyPhoneNumber } from '../slices/pageSlice';
import axios from 'axios';
import { shake } from '../animations/shake';
export default function LoginPage() {
	const [phonenumber, setPhoneNumber] = useState<string>('');
	const [ic, setIC] = useState<string>('');
	const dispatch = useDispatch();
	const [inputError, changeInputError] = useState<any>({});
	const [_, forceUpdate] = useReducer(x => x + 1, 0);

	function validPhoneNumber(pn:string) : boolean {
		const re = /^[0-9][0-9][0-9]{7,14}$/;

		if (pn === '')
			return false;
		if (pn.match(re))
			return true;
		return false;
	}

	return (
		<div>
			<Heading1>Enter your phone number</Heading1>
			{/* <Paragraph>
				WhatsApp will send an SMS message to verify your phone number.
				"What's my phone number ?"
			</Paragraph> */}

			<InputsWrapper>
			<Input 
					type="text" 
					placeholder="International Calling Code"
					
					variants={inputError['ic'] ? shake : {}}
					initial='hidden'
					animate='animate'

					value = { ic }
					onChange={ (e) => setIC(e.target.value) }
				/>
				<Input 
					type="text" 
					value = {phonenumber} 

					
					variants={inputError['phone-number'] ? shake : {}}
					
					initial='hidden'
					animate='animate'
					
					style = { (() : any => {
						if (phonenumber === '')
							return {  };

						if (validPhoneNumber(phonenumber))
							return {
								color: 'green',
								borderBottomColor: 'green',
							}
						else
							return {
								color: 'red',
								borderBottomColor: 'red',
							};
						
					})()}

					placeholder='Phone Number'
					onChange={ (e) => setPhoneNumber(e.target.value) }  
				/>
			</InputsWrapper>

			<div style={ { textAlign : 'center' }}>
				<Button onClick={() => {
					let data = {
						phoneNumber : phonenumber,
						code : ic,
						type : 'login'
					};
					
					let err:any = {};
					
					if (!validPhoneNumber(phonenumber) || phonenumber === '')
					{
						err['phone-number'] = true;
						changeInputError(err);
						setTimeout(() => changeInputError({}), 400);
						forceUpdate();
						return;
					}


					axios({
							url: "http://localhost:5000/send-SMS",
							method: "POST", 
							data
						})
						.then((res) => {

							localStorage.setItem('phoneNumberAuthToken', res.data.token);
							localStorage.setItem('authType', 'login');

							
							dispatch(verifyPhoneNumber());
						})
						.catch((err) => {
							
							err['phone-number'] = true;
							changeInputError(err);
							setTimeout(() => changeInputError({}), 400);
							forceUpdate();
						})

				}}>Next</Button>
			</div>
		</div>
	);

}
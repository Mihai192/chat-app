import React, { useEffect, useState, useReducer } from 'react';

import styled from 'styled-components';
import { Heading1 } from './AgreementPage';
import { Button, InputsWrapper } from './LoadingPage';
import AutoCompleteBox  from '../components/AutoCompleteBox';
import useEventListener from '@use-it/event-listener'
import axios from 'axios';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { shake } from '../animations/shake';
import { verifyPhoneNumber } from '../slices/pageSlice';



export default function SignUpPage(): React.ReactElement {
	const [countries, changeCountries] = useState<Array<any>>([]);
	const [onInputCountryFocus, changeInputCountryFocus] = useState<boolean>(false);
	const [currentCountry, changeCurrentCountry] = useState<any>(null);
	const [selectedCountry, changeSelectedCountry] = useState<number>(0);
	const [phoneNumber, changePhoneNumber] = useState<string>('');
	const [currentCountries, changeCurrentCountries] = useState<Array<any>>([]);
	const dispatch = useDispatch()
	const [inputError, changeInputError] = useState<any>({});
	const [_, forceUpdate] = useReducer(x => x + 1, 0);
	
	useEventListener('keydown', ({ key } : any) => {
		if (onInputCountryFocus && countries.length > 0)
		{
			

			if (key === 'ArrowUp')
			{
				
				changeSelectedCountry(selectedCountry - 1 < 0 ?  countries.length - 1 : selectedCountry - 1);
			}
			else if (key === 'ArrowDown')
			{
				
				changeSelectedCountry((selectedCountry + 1) % countries.length);
					
			}
			else if (key === 'Enter')
			{
				changeSelectedCountry(0);
				changeCurrentCountry(currentCountries[selectedCountry]);
				changeInputCountryFocus(false);
			}
		}
	});
	
	useEffect(() => {
		let getLocationPromise = new Promise((resolve, reject) => {
			if(navigator.geolocation) {
				navigator.geolocation.getCurrentPosition((position) => {
		
					const lat = position.coords.latitude
					const long = position.coords.longitude
		
					
					resolve({latitude: lat, 
							longitude: long})
				
					});
		
			} else {
				
				reject("your browser doesn't support geolocation API")
			}
		})
		
		axios.get('http://localhost:5000/phone-number-prefixes')
			.then((data:any) : Array<any> => {
				return data.data.countries;
			})
			.then((_countries:Array<any>) => {
				
				Promise.race([getLocationPromise, new Promise((resolve, reject) => {
					
					setTimeout(() => reject(new Error("Request timed out")), 1000);
				})]).then((data:any) => {
					console.log(data);
					return data;
				})
				.then((data:any) => {
					return axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${data.latitude}&lon=${data.longitude}`)
				})
				.then((data) => {
					
					if (_countries.length > 0)
					{
						
						const country = _countries.filter((c) => c.name === data.data.address.country);
							if (country.length > 0)
							{
								changeCountries(_countries);
								changeCurrentCountry(country[0]);
							}
					}
				})
				.catch((error) => {
					console.log(error);
					if (_countries.length > 0)
						changeCountries(_countries);
				})
				
				
			})
			.catch((error) => {
				console.log(error);
			})
	}, []);

	function validPhoneNumber(pn:string) : boolean {
		const re = /^[0-9][0-9][0-9]{7,14}$/;

		if (pn === '')
			return false;
		if (pn.match(re))
			return true;
		return false;
	}

	function validPhoneNumberCode(c:any) : boolean {
		if (c && c.name !== '' && c.code === '')
			return false
		else if (c && c.name !== '' && c.code !== '')
			return true
		return false;
	}

	
	return (
		<div>
			<Heading1>Enter your phone number</Heading1>
			<Paragraph>
				WhatsApp will send an SMS message to verify your phone number.
				"What's my phone number ?"
			</Paragraph>

			<div style={ { textAlign : 'center' }}>
				<InputCountry 
					value = {currentCountry ? currentCountry.name : ''}
					
					variants={ inputError['country'] ? shake : '' }
					

					initial='hidden'
					animate='animate'

					
					placeholder='Country'

					style = { (() : any => {
						if (currentCountry && currentCountry.name !== '' && currentCountry.code === '')
							return {
								color: 'red',
								borderBottomColor: 'red'
							};
						else if (currentCountry && currentCountry.name !== '' && currentCountry.code !== '')
							return {
								color: 'green',
								borderBottomColor: 'green'
							}
					})()}

					onChange={(e:React.ChangeEvent<HTMLInputElement>) => {
						if (!(countries.length > 0))
						{
							changeCurrentCountry({ name : e.target.value, code : ''})
							return;
						}

						const country = countries.filter((c) => c.name === e.target.value);
						
						const cc = countries.filter((country:any) => country.name.toLowerCase().startsWith(e.target.value.toLowerCase()));

						if (country.length > 0)
							changeCurrentCountry(country[0]);
						else
							changeCurrentCountry({ name : e.target.value, code : ''});

						changeCurrentCountries(cc);
					}}

					onFocus={() => {
						changeInputCountryFocus(true);
					}} 
					
					onBlur={() => {
						// changeSelectedCountry(0);
					}}
				/>		
				{ 
					onInputCountryFocus && 
					<AutoCompleteBox 
						_countries={
							(
								() : Array<any> => { 
									if (countries.length > 0 &&  currentCountry)
										return countries.filter((country:any) => country.name.toLowerCase().startsWith(currentCountry.name.toLowerCase()));
									else
										return [];
								}
							)() 
						} 
						
						currentCountry={currentCountry} 
						changeCurrentCountry={changeCurrentCountry}
						changeInputCountryFocus = {changeInputCountryFocus}
						selectedCountry = {selectedCountry}
					/> 
				}
			</div>

			<InputsWrapper>
				<Input 
					type="text" 
					placeholder="International Calling Code"
					
					variants={ inputError['code'] ? shake : '' }
					

					initial='hidden'
					animate='animate'

					style = { (() : any => {
						if (currentCountry === null)
							return {};

						if (validPhoneNumberCode(currentCountry)) 
							return {
								color: 'green',
								borderBottomColor: 'green'
							}
						else
							return {
								color: 'red',
								borderBottomColor: 'red'
							};
					})()}

					value = {currentCountry ? currentCountry.code : ''}	
					readOnly
				/>

				<Input 
					type="text" 
					value = {phoneNumber} 

					variants={ inputError['phone-number'] ? shake : ''}
					
					initial='hidden'
					animate='animate'
					
					style = { (() : any => {
						

						if (phoneNumber === '')
							return {};
						

						if (validPhoneNumber(phoneNumber))
							return {
								color: 'green',
								borderBottomColor: 'green'
							}
						else
							return {
								color: 'red',
								borderBottomColor: 'red'
							};
						
					})()}

					placeholder='Phone Number'
					onChange={ (e) => changePhoneNumber(e.target.value) }  
				/>
			</InputsWrapper>

			<div style={ { textAlign : 'center' }}>
				<Button onClick={function() {
					let data = {
						...currentCountry,
						phoneNumber,
						type : 'sign-up'
					};
					let err:any = {};

					if (!validPhoneNumber(phoneNumber) || phoneNumber === '')
						err['phone-number'] = true;
					
					if (!validPhoneNumberCode(currentCountry))
					{
						err['country'] = true;
						err['code'] = true;
					}

					if (validPhoneNumber(phoneNumber) && phoneNumber !== '')
						axios({
								url: "http://localhost:5000/send-SMS",
								method: "POST", 
								data
							})
							.then((res) => {
								
								localStorage.setItem('phoneNumberAuthToken', res.data.token);
								localStorage.setItem('authType', 'sign-up');
								dispatch(verifyPhoneNumber());
							})
							.catch(() => {
								
								err['phone-number'] = true;
								changeInputError(err);
								setTimeout(() => changeInputError({}), 400);
								forceUpdate();
							})
					
					
					if (!(Object.values(err).length === 0))
					{
						changeInputError(err);
						setTimeout(() => changeInputError({}), 400);
						forceUpdate();
					}
				}}>Next</Button>
			</div>
		</div>
	);
}

export const Paragraph = styled.p`
	text-align: center;
	font-size: 1.3rem;
`;

export const Input = styled(motion.input)`
	margin: 10px;
	text-align: center;
	margin: 20px;
	padding: 10px;
	outline: none;
	border: 2px solid black;
	border-top: none;
	border-left: none;
	border-right: none;
	font-size: 1.3rem;
`;

const InputCountry = styled(Input)`
	width: calc(60% + 40px);
	padding-left: 0;
	padding-right: 0;
	margin-left: 0;
	margin-right: 0;
	margin-bottom: 0;
`;


import React from "react";
import WhatsappLogo from '../images/WhatsApp_logo.png'
import styled from 'styled-components';

import {  useDispatch } from 'react-redux';
import { toAgreementPage, loginPage } from '../slices/pageSlice';


const LoadingPageStyled:React.FunctionComponent<any> = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
`;
export const Footer:React.FunctionComponent<any> = styled.div`
	text-align: center;
	padding: 10px 0px;
	span {
		color: #4444f9;
		text-transform: uppercase;
		letter-spacing: 1px;
	} 
`;

export const Content:React.FunctionComponent<any> = styled.div`
	flex: 1;
`;

export const ImgWrapper:React.FunctionComponent<any> = styled.div`
	margin-top: 15px;
	height: 30%;
	text-align: center;
	img {
		height: 100%;
	}
`;

export const Button = styled.button`
	
	background-color: green;
	color: white;
	border: none;
	outline: none;
	padding: 10px 25px;
	margin: 0px 10px;
	cursor: pointer;
	margin-top: 10px;
	border-radius: 1px;
	font-size: 1rem;
	
`;

export const InputsWrapper = styled.div`
	text-align: center;
	margin-top: 20px;
	input {
		width: 30%;
	}

	input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
`; 


export default function LoadingPage(): React.ReactElement  {
	const dispatch = useDispatch()
	return (
		<LoadingPageStyled>
			<Content>
				<ImgWrapper>
					<img src={WhatsappLogo} alt="Whatsapp logo" />
				</ImgWrapper>

				<InputsWrapper>
					<Button onClick={ () => {
						dispatch(toAgreementPage());
					}}>
						Sign up
					</Button>

					<Button onClick={ () => {
						dispatch(loginPage());
					}}>
						Login
					</Button>
				</InputsWrapper>
			</Content>

			<Footer>
				from <br />
				<span>Facebook</span>
			</Footer>
		</LoadingPageStyled>
	);
}




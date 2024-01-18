import React from 'react';
import {Content, Footer} from './LoadingPage';
import styled from 'styled-components';
import BackgroundImage from '../images/background-image.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { signUp } from '../slices/pageSlice';
import { Button } from './LoadingPage';
export default function AgreementPage(): React.ReactElement {
    const dispatch = useDispatch()

	return (
		<AgreementPageStyled>
			<Content>
				<Heading1>Welcome to Whatsapp</Heading1>

				<ImgWrapper>
					<img src={BackgroundImage} alt="Background image" />
				</ImgWrapper>


				<AgreementSection>
					<p>
						Read our Privacy Policy. Tap "Agree and Continue" to accept the Terms of Service.
					</p>

					<Button onClick={() => {
						dispatch(signUp());
					}}>Agree and Continue</Button>
				</AgreementSection>
				
			</Content>
		
			<Footer>
				from <br />
				<span>Facebook</span>
			</Footer>
		</AgreementPageStyled>
	);
}

const AgreementPageStyled: React.FunctionComponent<any> = styled.div`
	height: 100vh;
	display: flex;
	flex-direction: column;
`;

export const Heading1: React.FunctionComponent<any> = styled.h1`
	min-height: 10vh;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const imgHeight = '40vh';


const ImgWrapper: React.FunctionComponent<any> = styled.div`
	height: ${imgHeight};
	text-align: center;
	img {
		height: 100%;
		width:  ${imgHeight};
		border-radius: 50%;
		padding: 10px 0px;
	}
`;

const AgreementSection: React.FunctionComponent<any> = styled.div`
	text-align: center;
	min-height: 40vh;
	padding: 40px 0px;
	font-size: 1rem;

	
`


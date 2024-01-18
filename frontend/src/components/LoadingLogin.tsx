import React from 'react';
import styled from 'styled-components';
import WhatsappIcon from '../images/icons8-whatsapp-250.svg';
import Spinner from '../images/spinner.svg';

export default function LoadingLogin() {

	return (
		<LoadingLoginStyled>
			<Wrap>
				<div>
					<img src={WhatsappIcon} alt="Whatsapp icon" />
				</div>
				<div>
					<img src={Spinner} alt="Spinner" />
				</div>
			</Wrap>
		</LoadingLoginStyled>
	)
}

const LoadingLoginStyled = styled.div`
	background-color: #202c33;
	width: 100vw;
	height: 100vh;
	position: absolute;
`
const Wrap = styled.div`

	position: relative;
	top: 40%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	align-items: center;
	flex-direction: column;
	p {
		font-size: 2.5rem;
	}
`;
import React from 'react';
import styled from 'styled-components';
import PlaceHolderProfilePic from '../../images/placeholder-profile-picture.jpg';
import { faSearch, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { changeSideBarChatStatus } from '../../slices/appSlice';
import WrapDropDown from '../WrapDropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { changeActiveChat } from '../../slices/appSlice';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
export default function ChatHeader(props:any) : React.ReactElement {
	const dispatch = useDispatch();

	return (
		<ChatHeaderStyled>

			<BackButton onClick={ () => {
				dispatch(changeActiveChat(null));
			}}> 
				<FontAwesomeIcon icon={ faChevronLeft } size='2x' />
				
			</BackButton>
			<ImgWrapper>
				<img src={
						props.profile_image_name 
							? `http://localhost:5000/static/profile-images/${props.profile_image_name}`
							: PlaceHolderProfilePic
					} 
					alt="User profile" 
				/>
			</ImgWrapper>

			<ChatHeaderInfo>
				<div>{props.phoneNumber}</div>
				<p>{ props.online }</p>
			</ChatHeaderInfo>

			<Icons>
				<Icon icon={faSearch} onClick={ () => {
					dispatch(changeSideBarChatStatus(true));
				}} />
				
				<WrapDropDown icon={faEllipsisVertical}/>
			</Icons>
		</ChatHeaderStyled>
	);
}

const ChatHeaderStyled = styled.div`
	height: 10%;
	width: 100%;
	background-color: #202c33;
	display: flex;
	align-items: center;
	color: white;
`;


const ImgWrapper = styled.div`
	height: 100%;
	padding: 10px;
	img {
		height: 100%;
		border-radius: 50%;
		aspect-ratio: 1/1;
	}
`;

const ChatHeaderInfo = styled.div`
	flex: 1;
`;

const Icons = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	/* width: 15%; */
	flex-basis: 100px;
	gap: 10px;
	height: 100%;
`;

const Icon = styled(FontAwesomeIcon)`
	color: white;

	padding-right: 20px;
	
	cursor: pointer;
	display: flex;

`;

const BackButton = styled.button`
	border: none;
	outline: none;
	background-color: transparent;
	color: white;
	padding: 10px;
	margin-left: 10px;
	cursor: pointer;
`;
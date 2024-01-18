import React from 'react';
import styled from 'styled-components';
import PlaceHolderProfilePic from '../../images/placeholder-profile-picture.jpg';
import { useSelector, useDispatch } from "react-redux";
import { changeSideBarSettingsStatus, changeSideBarSettingsType } from '../../slices/appSlice';
import { faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { faSquarePlus, faCircleNotch, faUsers, faEllipsisVertical, faCommentDots } from '@fortawesome/free-solid-svg-icons'
import WrapDropDown from '../WrapDropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function SettingsSection() {
	const image = useSelector((state:any) => state.userDetails.image);
	const name = useSelector((state: any) => state.userDetails.name);
	const requests = useSelector((state: any) => state.requestsList.requests);
	const phoneNumber = useSelector((state : any) => state.userDetails.phoneNumber);
	const dispatch = useDispatch();

	
	return (
		<SettingsSectionStyled>
			<ImgWrapper  onClick={ () => {
					dispatch(changeSideBarSettingsStatus(true));
					dispatch(changeSideBarSettingsType('profile-edit'));
				}}>
				<img src={image ? image : PlaceHolderProfilePic} alt="User profile" />
			</ImgWrapper>
			
			<Name>
				{name ? name : phoneNumber}
			</Name>
			<Icons>	

				{ requests !== null && requests.length ?
				<RequestsWrapper>
					<div>
							{ requests.length }
						</div>
					<Icon icon={faUserFriends} onClick={ () => {
						dispatch(changeSideBarSettingsStatus(true));
						dispatch(changeSideBarSettingsType('requests-list'));
					}} />
				</RequestsWrapper>
				:
				<Icon icon={faUserFriends} onClick={ () => {
					dispatch(changeSideBarSettingsStatus(true));
					dispatch(changeSideBarSettingsType('requests-list'));
				}} />
				}
					
					<Icon icon={faSquarePlus} onClick={ () => {
						dispatch(changeSideBarSettingsStatus(true));
						dispatch(changeSideBarSettingsType('add-contact'));
					}} />	
				
				
				<WrapDropDown icon={faEllipsisVertical}/>
			</Icons>
		</SettingsSectionStyled>

	);
}


const SettingsSectionStyled = styled.div`
	width: 100%;
	height: 10vh;
	background-color: #202c33;
	display: flex;
`;

const ImgWrapper = styled.div`
	height: 100%;
	padding: 10px;
	img {
		height: 100%;
		aspect-ratio : 1 / 1;
		border-radius: 50%;
	}
	cursor: pointer;
`;

const Icons = styled.div`
	display: flex;
	align-items: center;
	justify-content: flex-end;
	gap: 20px;
	flex: 1;
`;

const Icon = styled(FontAwesomeIcon)`
	color: white;

	padding-right: 5px;
	cursor: pointer;
`;

const Name = styled.div`
	display: flex;
	align-items: center;
	color: white;
`;

const RequestsWrapper = styled.div`
	position: relative;

	& > div {
		position: absolute;
		top: 0;
		left: 0;
		transform: translate(-50%, -50%);
		padding: 1px;
		background-color: red;
		border-radius: 50%;
		pointer-events: none;
	}
`

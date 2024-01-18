import React, { useEffect, useState, useReducer, useRef } from 'react';
import styled from 'styled-components';
import PlaceHolderProfilePic from '../../images/placeholder-profile-picture.jpg';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { changeProfileImage, changeProfileImageName } from '../../slices/userDetailsSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
export default function ImgWrapperInput() : React.ReactElement {
	const [hover, changeHover] = useState<boolean>(false);
	const dispatch = useDispatch();
	const profile_image_name = useSelector((state:any) => state.userDetails.profile_image_name);
	const image = useSelector((state:any) => state.userDetails.image);


	function uploadImage(file:any) : void
	{
		const formData = new FormData()
		
		let token:string = localStorage.getItem('session-token') ?? ''; 
		
		formData.append('token', token);
		formData.append('image', file);
		axios.post('http://localhost:5000/upload-profile-image', formData, { headers: {'Content-Type': 'multipart/form-data'}})
			.then(async (data:any) => {
				
				console.log(data.data)
				await dispatch(changeProfileImageName(data.data.profile_image_name))
				dispatch(changeProfileImage('http://localhost:5000/static/profile-images/' + data.data.profile_image_name + `?dummy1 = ${(new Date()).toString()}`));
				
				
			})
			.catch(() => {

			})
	}


	async function onImageChange(event:any) {
		if (event.target.files && event.target.files[0]) 
		{
			dispatch(changeProfileImage(URL.createObjectURL(event.target.files[0])));
			//dispatch(changeProfileImageName(event.target.files[0]));
		}
		if (event.target.files[0])
			uploadImage(event.target.files[0]);
	}

	return (
		<Wrap>
			<ImgWrapperInputStyle>
				<Input 
					
					type="file" 
					onChange={onImageChange} 
					onMouseEnter={ () => {
						changeHover(true);
					}}

					onMouseLeave={ () => {
						changeHover(false);
					}}
				/>

				<Img 
					alt="preview image" 
					src={!image ? PlaceHolderProfilePic : image}
				/>

				<Overlay hover={ hover }>
					
					<div>
						<FontAwesomeIcon icon={faCamera} size='2x'/>
					</div>
					<p>Change profile photo</p>
				</Overlay>
			</ImgWrapperInputStyle>
		</Wrap>
	);
}

const Input = styled.input`
	
	opacity: 0;
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);

	height: 100%;
	cursor: pointer;
	z-index: 2000000;
`;

const Img = styled.img`
	 
	width: 200px;
	height: 200px;
	border-radius: 50%;
`;


const Wrap = styled.div`
	/* height: 10%; */
	padding: 15px;
	
`;


const ImgWrapperInputStyle = styled.div`
	
	display: flex;
	justify-content: center;
	position: relative;
`;

const Overlay = styled.div<{hover : boolean}>`
	position: absolute;
	
	width: 200px;
	height: 200px;
	
	background-color: ${props => props.hover ? '#202c33c2' : 'transparent'};
	color: ${props => props.hover ? 'white' : 'transparent'};
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;

	cursor: pointer;

	

	
	transition: 0.5s all ease;

	
`;
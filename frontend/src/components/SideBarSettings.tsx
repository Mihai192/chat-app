import React from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { changeSideBarSettingsStatus, changeSideBarSettingsType } from "../slices/appSlice";

export default function SideBarSettings(props:any) : React.ReactElement {
	const sideBarActive:boolean = useSelector((state: any) => state.app.sideBarSettingsActive);	
	const dispatch = useDispatch();
	return (
		<SideBarStyled value = { sideBarActive }>
			<SideBarHeaderStyled>
				<Icon icon={faArrowLeft} size="2x" onClick={ () => {
					dispatch(changeSideBarSettingsStatus(false));
					dispatch(changeSideBarSettingsType(''));
				} }/>

				<Header>{props.header}</Header>
			</SideBarHeaderStyled>

			{ props.children }			
		</SideBarStyled>
	);
}

const Icon = styled(FontAwesomeIcon)`
	
	color: white;
	padding: 20px;
	cursor: pointer;
`;


const SideBarStyled = styled.div<{ value : boolean }>`
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: ${p => { if (p.value) return '0%'; else return '-100%'; }};
	background-color: #111b21;

	transition: 0.4s all ease;
`;

const SideBarHeaderStyled = styled.div`

	display: flex;
	padding: 5px;
	background-color: #202c33;
`;

const Header = styled.h1`
	display: flex;
	align-items: center;
	color: white;
`;
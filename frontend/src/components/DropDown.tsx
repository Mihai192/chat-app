import React from 'react';
import styled from 'styled-components';
import { useRef, useEffect, useState } from 'react';


function getOffset(el:HTMLDivElement) : any {
	const rect = el.getBoundingClientRect();
	
	return {
	  x: rect.left + rect.width / 2 + window.scrollX,
	  y: rect.top + rect.height / 2 + window.scrollY,
	  
	};

	// return {
	// 	x: el.offsetLeft + el.offsetWidth / 2,
	// 	y: el.offsetTop + el.offsetHeight / 2
	// }
}

function getCoordinates(
	offset:any, // top and left corner of the wrapper
	wrapperWidth:any,
	wrapperHeight:any,
	dropDownWidth:number, 
	dropDownHeight:number
) : any {
	
	if (offset.x !== undefined && offset.y !== undefined) 
	{
		
		offset.x = offset.x + wrapperWidth / 2;
		offset.y = offset.y + wrapperHeight / 2;

		if (offset.x + dropDownWidth <= window.innerWidth && offset.y  + dropDownHeight <= window.innerHeight)
			return { left: wrapperWidth / 2, top: wrapperHeight / 2, bottom : undefined, right : undefined};
		else if (offset.x - dropDownWidth <= window.innerWidth && offset.y + dropDownHeight <= window.innerHeight)
			return { right : wrapperWidth / 2, top : wrapperHeight / 2, left: undefined, bottom: undefined};
		else if (offset.x - dropDownWidth <= window.innerWidth && offset.y - dropDownHeight <= window.innerHeight)
			return { left : wrapperWidth / 2, bottom: wrapperHeight / 2, right : undefined, top: undefined};
		else if (offset.x + dropDownWidth <= window.innerWidth && offset.y - dropDownHeight <= window.innerHeight)
			return { right: wrapperWidth / 2, bottom: wrapperHeight / 2, left : undefined, top: undefined};
	}

	return {
		right: undefined, bottom: undefined, left : undefined, top: undefined
	}
}

export default function DropDown(props : any) : React.ReactElement {
	const {width, height} = props;
		

	let value;

	if (props.wrapper)
	{
		let wrapper = props?.wrapper.getBoundingClientRect();
		let wrapperX = wrapper?.left;
		let wrapperY = wrapper?.top;
		let wrapperWidth = wrapper?.width;
		let wrapperHeight = wrapper?.height;
		value = getCoordinates({ x : wrapperX, y : wrapperY }, wrapperWidth, wrapperHeight, width, height);
	}
	
	
	return (
		<List 
			tabIndex={0}
			value = { props.active } 

			top = { value ? value.top : undefined } 
			left = { value ? value.left : undefined  } 
			right = { value ? value.right : undefined }
			bottom = { value ? value.bottom : undefined }
			width = { width } 
			height = { height }
			
			onBlur = { () => {
				
				
			}}
		>
			<ListItem>Contact Info</ListItem>
			<ListItem>Select Messages</ListItem>
			<ListItem>Close Chat</ListItem>
			<ListItem>Dissappearing Messages</ListItem>
			<ListItem>Clear Chat</ListItem>
		</List>
	)
	
}

const List = styled.div<{
		value : boolean, 
		top : number | undefined, 
		left : number | undefined, 
		right : number | undefined,
		bottom : number | undefined,
		width : number, 
		height: number
}>`
	background-color: #202c33;
	width: ${p => { if (p.value) return p.width; else return 0;}}px;
	height: ${p => { if (p.value) return p.height; else return 0;}}px;
	position: absolute;
	overflow: hidden;
	
	${p => p.top !== undefined ? 'top: ' + p.top + 'px;' : '' }
	${p => p.left !== undefined ? 'left: ' + p.left + 'px;' : '' }
	${p => p.right !== undefined ? 'right: ' + p.right + 'px;' : '' }
	${p => p.bottom !== undefined ? 'bottom: ' + p.bottom + 'px;' : '' }

	
	transition: 0.1s all ease-in-out;
`;

const ListItem = styled.div`
	padding: 20px;
	width: 100%;
	color: white;
	cursor: pointer;

	&:hover {
		background-color: #353f45;
	}
`;
import React from "react";
import styled from "styled-components";

export default function Time(props:any) {
	return (
		<DateWrapper>
			<Date>{props.date}</Date>
		</DateWrapper>
	);
}

const DateWrapper = styled.div`
	text-align: center;
`;

const Date = styled.div`
	color: white;
	display: inline-block;
	max-width: 70%;
	padding: 5px 10px;
	border-radius: 5px;
	background-color: #005c4b;
	text-align: center;
	margin: 10px 0px;
`;
import React from "react";
import styled from "styled-components";
import AutoCompleteList from "./AutoCompleteList";

export default function AutoCompleteBox({ _countries, changeCurrentCountry, changeInputCountryFocus, selectedCountry }:any): React.ReactElement {
	let toReturn = <div></div>;
	
	if (_countries.length > 0)
		toReturn = (
				<Box tabIndex={selectedCountry}> 
					<AutoCompleteList 
						countries={_countries} 
						changeCurrentCountry={changeCurrentCountry} 
						changeInputCountryFocus={changeInputCountryFocus}
						selectedCountry = {selectedCountry}
					/>  
				</Box>
			);
	
	return toReturn;
}

const Box = styled.div`
	position: fixed;
	
	left: calc( calc(100% - calc(60% + 40px)) / 2); 
	background-color: black;
	color: white;
	overflow-y: auto;
	height: 60%;
	width: calc(60% + 40px);

	div {
		text-align: start;
		padding: 20px;
		font-size: 1.5rem;
	}

	
`;
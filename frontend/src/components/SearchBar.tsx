import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faX } from '@fortawesome/free-solid-svg-icons'

/*
	Parameter props.placeHolder:string  --> placeHolder of the search bar
	Parameter props.onKeyDown:(e, input:string) => void --> callback to be called when Enter is pressed
	Parameter props.onChange: (input:string) => void --> callback to be called on every key is pressed
*/
export default function SearchBar(props:any) : React.ReactElement {
	const [input, changeInput] = useState<string>('');

	return (
		<SearchBarStyled>
			<Wrapper>
				<IconWrapper>
					<Icon icon={faMagnifyingGlass} size='1x' />
				</IconWrapper>

				<InputWrapper>
					<Input 
						type="text" 
						placeholder={props.placeHolder} 
						onKeyDown={ (e) => {
								if (e.key === 'Enter')
									props.onKeyDown(input); 
										
							}}
						value = { input }
						onChange = { (e) => { changeInput(e.target.value);  if(props.onChange) props.onChange(e.target.value) }}
					/>
				</InputWrapper>

				{ input && 
					<IconWrapper>

						<button onClick={ () => { changeInput('');  if(props.onChange) props.onChange(''); } }>
							<Icon icon={faX} size='1x' />
						</button>
					</IconWrapper>
				}
			</Wrapper>

		</SearchBarStyled>
	);
}

const SearchBarStyled = styled.div`
	width: 100%;
	min-height: 10vh;
	padding: 10px;
	background-color: #111b21;
	display: flex;
`;

const Wrapper = styled.div`
	display: flex;
	
	background-color: #222e35;
	border-radius: 5px;
	flex: 1;
	padding: 5px 10px;
	gap: 10px;
`;

const InputWrapper = styled.div`
	flex: 1;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const Input = styled.input`
	width: 100%;
	
	border: none;
	outline: none;
	color: white;
	background-color: #222e35;
	border-radius: 5px;
	/* padding: 10px 0px; */
	font-size: 20px;
`;

const Icon = styled(FontAwesomeIcon)`
	color: white;	
`;

export const IconWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	/* padding: 5px 10px; */
	button {
		background-color: transparent;
		border: none;
		outline: none;
		cursor: pointer;

		svg {
			font-size: 20px;
		}
	}
`;
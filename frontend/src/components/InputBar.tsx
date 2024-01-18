import React, { useState } from 'react';
import styled from 'styled-components';

export default function InputBar(props:any) : React.ReactElement {
	const [input, changeInput] = useState<string>('');

	return (
		<InputBarStyled>
			<InputWrapper>
				<Input  
					placeholder={'Type a message...'} 
					spellCheck={false} 
					onChange={(e) => changeInput(e.target.value)}
					value = { input }
					onKeyDown={ async (e) => {
						if (e.key === 'Enter') 
						{
							//console.log(input);

							props.callback(input);
							changeInput('');
						}
					}}
				/>
			</InputWrapper>
		</InputBarStyled>
	);
}

const InputBarStyled = styled.div`
	/* width: 100%; */
	min-height: 10vh;
	flex:1;
	padding: 5px 3px;
	background-color: #2a3942;
	display: flex;
	
`;

const InputWrapper = styled.div`
	
	display: flex;
	/* padding: 5px; */
	
	background-color: #2a3942;
	border-radius: 5px;
	flex: 1;
`;

const Input = styled.textarea`
	width: 100%;
	
	border: none;
	outline: none;
	color: white;
	background-color: #2a3942;
	font-size: 25px;
	resize: none;
	margin-left: 1px;
`;





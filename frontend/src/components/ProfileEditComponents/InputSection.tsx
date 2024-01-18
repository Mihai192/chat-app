import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import styled from 'styled-components';
import AnimatedIcon from './AnimatedIcon';
import { motion, useAnimation } from 'framer-motion';
import { fadeIn } from '../../animations/fadeIn';
import { fadeOut } from '../../animations/fadeOut';

export default function InputSection(props:any) {
	const [input, changeInput] = useState<string>('');
	const [inputActive, changeInputActive] = useState<boolean>(false);
	const ref = useRef<HTMLTextAreaElement|null>(null);
	const controls = useAnimation();
	const [iconType, changeIconType] = useState<number>(0);

	function adjustHeight() {
		if (ref && ref.current)
		{
			ref.current.style.height = "inherit";

			if (ref.current.scrollHeight <= 70)
				ref.current.style.height = `${ref.current.scrollHeight}px`;
			else
				ref.current.style.height = '70px';
		}
	}
	
	useEffect(() => { 
		console.log('rerender ??')
		changeInput(props.value)
}	, [])
	useLayoutEffect(adjustHeight, []);
	
	return (
		<InputSectionStyled>
			<label htmlFor={props.labelFor}>{props.labelName}</label>
			<InputWrapper active={ inputActive }>
				{ 
					props.inputType 
					?
						<input 
							disabled={!inputActive}
							type="text" 
							onChange={(e) => changeInput(e.target.value) } 
							value = { input ? input : ''}
							maxLength={ props.maxLength }		
							spellCheck={false}
						/>
					:
						<textarea 
							disabled={!inputActive}
							ref={ref} 
							rows={1}
							onChange={(e) => { 
								adjustHeight();

								changeInput(e.target.value)	
							}} 
							spellCheck={false}
							maxLength={props.maxLength}		
							value = { input ? input : '' }	
						/>
				}
				

				<TextLengthConstraint
					variants={ inputActive ? fadeIn : fadeOut }
					animate='animate'
					initial='hidden'

				>
					{input !== null ? props.maxLength - input.length : props.maxLength}
				</TextLengthConstraint>

				<button onClick={ async () => {
					
					const sequence = async () => {
						// Fade out and shrink
						await controls.start({ x: 0, opacity: 1, scale: 1 });
						await controls.start({ x: 10, opacity: 1, scale: 1 });
						// Shrink to 0
						await controls.start({ scale: 0, opacity: 0 });
						// Reset to the initial state
						//await controls.start({ x: 0, opacity: 0, scale: 1 });
						// Fade in
						//await controls.start({ opacity: 1 });
						// await controls.start({ opacity: 0 });
						// Fade in and expand
						// await changeActiveInput(1);
						await changeIconType(iconType ? 0 : 1);

						await controls.start({ x: 0, opacity: 0, scale: 0 });
						await controls.start({ x: 0, opacity: 1, scale: 1 });
						
						
					};
				
					await sequence();
					await changeInputActive(!inputActive);

					if (inputActive)
						props.callback(input);
					}}


				>
					<AnimatedIcon 
						active = { inputActive } 
						controls = { controls }
						iconType = { iconType } 
					/>
				</button>
			</InputWrapper>
		</InputSectionStyled>
	);
}

const TextLengthConstraint = styled(motion.div)`
	display: flex;
	justify-content: center;
	align-items: center;
	
	padding: 10px 5px;
`;

const InputSectionStyled = styled.div`
	padding: 10px;
	
	label {
		margin-bottom: 20px;
		font-size: 1.3rem;
	}

	input {
		display: inline-block;
    	width: 100%;
	}

	input, textarea {
		font-size: 1.3rem;
		padding: 5px;
		outline: none;
		background-color: transparent;
		border: none;
		color: white;
		display: inline-block;
		pointer-events: none;
		
	}

	button {
		cursor: pointer;
		padding: 10px 0px;
		
		//height: 20px;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	textarea {
		resize: none;
		overflow: hidden;
		pointer-events: none;
	}
`;

const InputWrapper = styled.div<{active:boolean}>`
	border-bottom: ${ p => p.active ?  '1px solid green' : '1px solid transparent'};
	display: flex;

	input, textarea {
		flex: 1;
		pointer-events: ${p => p.active ? 'auto' : 'none' };
	}
	button {
		background: none;
		outline: none;
		border: none;
		display: inline-block;
		width: 40px!important;
		/* height: 40px;  */
	}
`;

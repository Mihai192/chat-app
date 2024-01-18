import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import DropDown from './DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function WrapDropDown(props:any) {
	const [dropDownActive, changeDropDownActive] = useState<boolean>(false);
	
	const ref = useRef<HTMLDivElement | null>(null);


    const handleClickOutside = (event:any) => {
        if (ref.current && !ref.current.contains(event.target)) {
            changeDropDownActive(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

	return (
		<Wrap ref={ref}>
			<Icon 
				icon={props.icon} 
				style={ { paddingRight : "20px" } } 
				onClick={() => {
					changeDropDownActive(!dropDownActive);
				}}
			/>
			<DropDown 
				active = { dropDownActive } 
				width = { 200 } 
				height = { 300 } 
				wrapper = {ref.current}
				changeDropDownActive = { changeDropDownActive }
			/>
		</Wrap>
	)
}

const Icon = styled(FontAwesomeIcon)`
	color: white;

	padding-right: 5px;
	/* padding: 20px; */
	cursor: pointer;
`;

const Wrap = styled.div`
	position: relative;
`
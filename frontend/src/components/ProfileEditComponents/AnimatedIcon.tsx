import React, { useState, useRef } from 'react'; 
import {motion, useAnimation} from 'framer-motion';
import styled from 'styled-components';
import { faPen, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function AnimatedIcon(props: any) {
	
	return (
		<motion.span>
			<Icon 
				icon={ props.iconType === 0 ? faPen : faCheck }
				initial={{ opacity: 1, scale: 1 }}
				animate = { props.controls }
			/> 
		</motion.span>	
	)
}

const Icon = styled(motion(FontAwesomeIcon))`
	color: white;
`;

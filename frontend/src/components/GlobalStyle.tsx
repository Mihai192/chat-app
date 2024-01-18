import { createGlobalStyle } from 'styled-components';


const GlobalStyle = createGlobalStyle`

	* {
		padding: 0;
		margin: 0;
		box-sizing: border-box;
		font-family: sans-serif;
	}
	body {
		overflow: hidden;
	}
	
	/* width */
	::-webkit-scrollbar {
		width: 10px;
		
	}

	/* Track */
	::-webkit-scrollbar-track {
	background: #f1f1f1;
	}

	/* Handle */
	::-webkit-scrollbar-thumb {
	background: #888;
	}

	/* Handle on hover */
	::-webkit-scrollbar-thumb:hover {
	background: #555;
	}
`;

export default GlobalStyle;
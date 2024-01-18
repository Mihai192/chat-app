import React from 'react';
import LoadingPage from './pages/LoadingPage';
import AgreementPage from './pages/AgreementPage';
import GlobalStyle from './components/GlobalStyle';
import VerifyPhoneNumberPage from './pages/VerifyPhoneNumberPage';
import { useSelector } from 'react-redux';
import AppPage from './pages/AppPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import Auth from './components/Auth';

function App() {
	const pageState = useSelector((state: any) => state.page.type);
	
	function getPage() {
		switch(pageState) 
		{
			case 'loading':
				return <LoadingPage />;
			case 'agreement':
				return <AgreementPage />
			case 'verify-phone-number':
				return <VerifyPhoneNumberPage type = { localStorage.getItem('authType') }/>
			case 'sign-up':
				return <SignUpPage />
			case 'app-page':
				return (
					<AppPage />
				);
			case 'login-page': 
				return <LoginPage />
			default: 
				return <LoadingPage />
		}
	}


	return (
		<div>
			<GlobalStyle />
			<Auth>
				{ getPage() }
			</Auth>
		</div>
	);
}

export default App;

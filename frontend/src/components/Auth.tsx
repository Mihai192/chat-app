import React, { useState, useEffect } from 'react';
import LoadingPage from '../pages/LoadingPage';
import axios from 'axios';
import AppPage from '../pages/AppPage';
import LoadingLogin from './LoadingLogin';
import { useDispatch } from 'react-redux';
import { appPage, toLoadingPage } from '../slices/pageSlice';
// export default function Auth(props:any) : React.ReactElement {
// 	// TODO: uncaught promise bug
// 	async function wrap() {
// 		async function isLoggedIn()  {
// 			// if it's not set
// 			if (!localStorage.getItem('session-token'))
// 				return false;
	
// 			// if it's set and it is a valid session token 
// 			let data ={
// 				'token' : localStorage.getItem('session-token')
// 			};
	
// 			try {
// 				let test:any = await (async () => {
// 					try {
// 						let res = await axios({
// 							url: "http://localhost:5000/validate-token",
// 							method: "POST", 
// 							data
// 						}) 
						
// 						if (res.status === 404)
// 							return false;

// 						return true;
// 					} catch(err) {
						
// 						return false;
// 					}
					
// 				})() ;
	
				
// 				console.log(test);
				
// 				return test;
// 			} catch(err) {
// 				return false;
// 			}
// 		}
	
// 		let value =  await isLoggedIn();
// 		return value
// 	}
	
// 	let value = wrap();
	
// 	value.then((result) => {
// 		if (result)
// 			return <AppPage />
// 		else
// 		{
				
// 			if (props.children === AppPage)
// 				return <LoadingPage />
// 			else
// 				return props.children;
// 		}
// 	})
// }

export default function Auth(props: any): React.ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    async function checkLoginStatus() {
      // if it's not set
      if (!localStorage.getItem('session-token')) {
        setIsLoggedIn(false);
        return;
      }

      // if it's set and it is a valid session token
      let data = {
        token: localStorage.getItem('session-token'),
      };

      try {
        let res = await axios({
          url: "http://localhost:5000/validate-token",
          method: "POST",
          data,
        });

        if (res.status === 404) {
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    }

    checkLoginStatus();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  console.log('checking login status...')
  console.log(isLoggedIn);
  
  if (isLoggedIn === null) {
    
    return <LoadingLogin />;
  } else if (isLoggedIn) {
	dispatch(appPage());
    return <AppPage />;
  } else {
    if (props.children === AppPage) {
		dispatch(toLoadingPage());
      return <LoadingPage />;
    } else {
      return props.children;
    }
  }
}
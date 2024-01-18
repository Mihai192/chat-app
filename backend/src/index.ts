

require('dotenv').config();

const axios = require('axios');
const fs = require("fs/promises");
const filesystem = require("fs");

const cors = require('cors');
const bodyParser = require('body-parser');
const socketIo = require('socket.io');
const http = require('http');

const express = require('express');

const formidable = require('formidable')
const path = require('path');
const functions = require('./utility');
const smsAPI = require('./smsAPIsettings');
const { db } = require('./firebase');

const app = express();
const port = 5000;


const server = http.createServer(app);

const { getDocs, setDoc, addDoc, add, set, getDoc, collection, deleteDoc, doc, query, where, updateDoc, onSnapshot } = require('firebase/firestore');

const io = socketIo(server,{ 
    cors: {
      origin: 'http://localhost:3000'
    }
});

let connectedUsers = [];

io.on('connection',(socket) => {
	console.log('client connected: ',socket.id)
	
	let token:string = '';
	let id;

	socket.on('token', (t) => {
		token = t;

		let promise = isLoggedIn(token);

		promise.then((value) => {
			if (value)
			{
				id = value;

				connectedUsers.push({ id, socketId : socket.id });

				const userRequestsDocument = doc(collection(db, 'userRequests'), id);

				const subcollectionRef = collection(userRequestsDocument, 'requests');
				
				const contactsCollectionRef = doc(collection(db, 'userContacts'), id);

				const subCollectionContactsRef = collection(contactsCollectionRef, 'contacts');

				const messagesCollectionRef = doc(collection(db, 'userMessages'), id);

				const subCollectionMessagesRef = collection(messagesCollectionRef, 'messages');

				onSnapshot(subcollectionRef, async (snapshot) => {
					let arr = [];
				
					const promises = [];
				
					snapshot.forEach((data) => {
						let obj = data.data();
						
						console.log(obj);
						if (obj.id !== undefined) {
							const promise = getUserDetails(obj.id).then(async (value) => {
								if (value) 
								{	
									
									let toAdd:any = {
										id : value.id,
										name : value.name,
										description : value.description,
										profile_image_name : value.profile_image_name,
										timestamp : obj.timestamp
									};

									const promise = getPhoneNumberWith(obj.id).then(data => {
										if (data)
											toAdd = { ...toAdd, phoneNumber : data.phoneNumber };
										arr.push(toAdd);	
									}).catch(() => {
										arr.push(toAdd);	
									})
									
									await promise;
								}
							}).catch((err) => {
								// Handle errors if needed
							});
				
							promises.push(promise);
						}
					});
				
					// Wait for all promises to resolve before emitting the data
					await Promise.all(promises);
				
					// Now arr is populated with data from all resolved promises
					socket.emit('requests', arr);
				});


				onSnapshot(subCollectionContactsRef, async (snapshot) => {
					let arr = [];
				
					const promises = [];

					snapshot.forEach((s) => {
						
						let data = s.data();
						let id = s.id;

						if (s.id <= 30) // the empty doc
							return; 

						
						
						
						const promise = getUserDetails(id).then(async (value) => {
							if (value) 
							{	
								
								let toAdd:any = {
									id : value.id,
									name : value.name,
									description : value.description,
									profile_image_name : value.profile_image_name,
									timestamp : data.timestamp
								};

								const promise = getPhoneNumberWith(id).then(data => {
									if (data)
										toAdd = { ...toAdd, phoneNumber : data.phoneNumber };
									arr.push(toAdd);	
								}).catch(() => {
									arr.push(toAdd);	
								})
								
								await promise;
							}
						}).catch((err) => {
							// Handle errors if needed
						});
			
						promises.push(promise);

						socket.emit('')
						console.log('--------------------------- END ---------------------------')
					})


					await Promise.all(promises);
				
					// Now arr is populated with data from all resolved promises
					socket.emit('contacts', arr);
				});


				onSnapshot(subCollectionMessagesRef, async (snapshot) => {
					let arr = [];

					snapshot.forEach((s) => {
						let data = s.data();
						arr.push(data);
					});

					
					// arr.sort((a:any, b:any) : number => {
					// 	let key1 = a.date;
					// 	let key2 = b.date;
					// 	console.log('Dates:', a, ' ', b);
					// 	if (key1 < key2) {
					// 		return -1;
					// 	} else if (key1 == key2) {
					// 		return 0;
					// 	} else {
					// 		return 1;
					// 	}
					// });
					socket.emit('messages', arr);
				});
			}
			else
			{

			}
		})
		.catch((err) => {

		});
	});
	
	socket.on('online', (data) => {
		console.log(data);
	});


	socket.on('disconnect',(reason)=>{
		connectedUsers = connectedUsers.filter((user) => {
			if (socket.id !== user.socketId)
				return user;
		});
	});
});







app.use('/static', express.static(path.join(__dirname, '../storage/')));

app.use( cors() );

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({extended : true}))




async function interval() {
	const querySnapshot = await getDocs(collection(db, "phoneNumberAuth"));
	querySnapshot.forEach((_doc) => {
		
		let docData = _doc.data();
		let docId = _doc.id;

		let currentTime = new Date();
		
		
		if (docData.timestamp !== undefined)
		{
			

			let docTimestampTime = docData.timestamp.toDate();

		
			let value:number = (currentTime.getTime() / 1000 / 60 - docTimestampTime.getTime() / 1000 / 60);
			
			console.log(value);
			if (value >= 5)
				deleteDoc(doc(db, "phoneNumberAuth", docId)).then(() => {
					
				}).catch(() => {
					
				});
				
		}
	});
}


// TODO: CHANGE THE SMS API
function sendSMS(phoneNumber : string, text : string ) : Promise<any> {
	const settings = smsAPI.settings(phoneNumber, text);

	return axios(settings);
}

// async function getPhoneNumbers() : Promise<any> {
// 	const phoneNumberCollection = collection(db, 'phoneNumber');
// 	const data = await getDocs(phoneNumberCollection);
// 	return data;
// }

async function isLoggedIn(token) {
	const ref = collection(db, 'user');
		
	const q = query(ref, where('session_token', '==', token));

	
	
	return getDocs(q).then((querySnapshot) => {
			console.log('here...');
			if (querySnapshot.size > 0) 
			{
				let id;
				
				querySnapshot.forEach((doc) => {
					id = doc.data().id;
					
				});

				return Promise.resolve(id);
			}
			return Promise.resolve(false);	
		});
}


function generateToken(num : number) : string {
	return require('crypto').randomBytes(num).toString('hex');
}

function randomNumber() : number {
	return Math.floor(1000 + Math.random() * 9000);
}

async function addPhoneNumberAuth(phoneNumber : string, rn : number ) : Promise<any> {
	const phoneNumberAuthDocument = doc(collection(db, 'phoneNumberAuth'));
	let token = generateToken(64);

	let obj = {
		phoneNumber,
		token,
		randomNumber : rn,
		timestamp : new Date()
	};


	await setDoc(phoneNumberAuthDocument, obj);
	return token;
}

function phoneNumberExists(phoneNumber) {
	const ref = collection(db, 'user');
		
	const q = query(ref, where('phoneNumber', '==', phoneNumber));
		
		
	return getDocs(q)
		.then((querySnapshot) => {
			// console.log(querySnapshot);
			if (querySnapshot.size > 0) 
				return Promise.resolve(true);
			
			return Promise.resolve(false);	
		});
}

function updateUser(phoneNumber)  {
	const userCollectionRef = collection(db, 'user');
	const userQuery = query(userCollectionRef, where('phoneNumber', '==', phoneNumber));
	const session_token = generateToken(64);

	// return [];
	return getDocs(userQuery)
		.then((querySnapshot) => {
			console.log('im...hereeeeeeeeeeeeee QUERY SNAPSHOT')
			if (querySnapshot.size === 0)
				return Promise.reject();
			return querySnapshot;
		})
		.then((querySnapshot) => {
			let arr = [];
			//console.log(querySnapshot.size)
			querySnapshot.forEach((doc) => {
				// Get the document reference
				arr.push(doc);
			});
			
			//console.log(arr[0].id);

			const userDocRef = doc(db, 'user', arr[0].id);

				
			return [session_token, updateDoc(userDocRef, { ...doc.data, session_token })]
		});
}

async function getUserIdWithPhoneNumber(phoneNumber) {
	const ref = collection(db, 'user');
		
	const q = query(ref, where('phoneNumber', '==', phoneNumber));
		
	
	let data = getDocs(q)
		.then((querySnapshot) => {
			// console.log(querySnapshot);
			if (querySnapshot.size > 0) 
			{
				let data = [];

				

				querySnapshot.forEach((userDetails) => {
					data.push( userDetails.data().id );

					// console.log('here...', userDetails.data());
					
				})

				
				
				return Promise.resolve(data[0]);
			}
			
			return Promise.resolve(false);	
		});
	return data;
}

async function initUserRequests(id) {
	try {
	const userRequestsDocument = doc(collection(db, 'userRequests'), id);


	await setDoc(userRequestsDocument, {})
	
		
	const subcollectionRef = collection(userRequestsDocument, 'requests');
	const emptyDocumentRef = addDoc(subcollectionRef, {});
	} catch(err) {

	}
}	

async function addUserRequest(senderId:string, receiverId:string) {
	try {
		const userRequestsDocument = doc(collection(db, 'userRequests'), receiverId);

		
			
		const subcollectionRef = collection(userRequestsDocument, 'requests');
		const emptyDocumentRef = addDoc(subcollectionRef, { id : senderId, timestamp: new Date() });
	} catch(err) {
			
	}
}

async function deleteUserRequest(senderId:string, receiverId:string) {
	try {
		const userRequestsDocument = doc(collection(db, 'userRequests'), receiverId);
		const subcollectionRef = collection(userRequestsDocument, 'requests');
	
		// Query to find the document with id equal to senderId
		const querySnapshot = await getDocs(query(subcollectionRef, where('id', '==', senderId)));
	
		// Check if there are any matching documents
		if (!querySnapshot.empty) {
		  // Assuming there is only one matching document, delete it
		  const documentToDeleteRef = doc(subcollectionRef, querySnapshot.docs[0].id);
		  await deleteDoc(documentToDeleteRef);
		} else {
		  // Handle the case where no matching document is found
		  console.log(`Document with id ${senderId} not found in userRequests/${receiverId}/requests`);
		}
	  } catch (err) {
		// Handle errors
		console.error('Error deleting document:', err);
	  }
}

// both ways...
async function existsUserRequest(senderId:string, receiverId:string) {
	const userRequestsDocument = doc(collection(db, 'userRequests'), receiverId);
	const subcollectionRef = collection(userRequestsDocument, 'requests');
  
	// Use a query to check if a document with the specified 'senderId' exists
	const q = query(subcollectionRef, where('id', '==', senderId));
  
	try {
	  const querySnapshot = await getDocs(q);
	
		

	  // Check if there are any documents matching the query
	  return querySnapshot.size > 0;
	} catch (error) {
	  console.error('Error checking user request existence: ', error);
	  return false; // Return false in case of an error
	}
}

async function initUserContacts(id:string) {
	try {
        const contactsCollectionRef = doc(collection(db, `userContacts/${id}/contacts`));

        // Use setDoc to create an empty document at the specified path
        await setDoc(contactsCollectionRef, {});

        console.log('Empty contact document created successfully');
    } catch (err) {
        // Handle errors
        console.error('Error creating empty contact document:', err);
    }
}


async function initUserMessages(id1: string) {
	const userMessagesCollection = collection(db, 'userMessages');
  
	// Create or get the document for user1
	const user1DocumentRef = doc(userMessagesCollection, id1);
	const user1Document = await getDoc(user1DocumentRef);
	if (!user1Document.exists()) {
	  await setDoc(user1DocumentRef, {});
	}
  
	// Create or get the messages collection for user1
	const messagesCollectionRef1 = collection(userMessagesCollection, id1, 'messages');
  
	// Create an empty document in the messages collection for user1
	const emptyMessageDocumentRef1 = doc(messagesCollectionRef1);
	const emptyMessageDocument1 = await getDoc(emptyMessageDocumentRef1);
  
	// Check if the document exists before attempting to set data
	if (!emptyMessageDocument1.exists()) {
	  await setDoc(emptyMessageDocumentRef1, {});
	}
  

}
  
  
function addUser(phoneNumber, name) : Array<any> {
	const userDocument = doc(collection(db, 'user'));
	
	const session_token = generateToken(64);
	let obj = {
		id : generateToken(30),
		phoneNumber,
		session_token,
		timestamp : new Date()
	};

	addUserDetails('', '', obj.id).then(() => {}).catch(() => {});
	
	try {
		initUserRequests(obj.id);
		initUserContacts(obj.id);
		initUserMessages(obj.id);
	} catch(err) {
		// die peacefully
	}

	return [session_token, setDoc(userDocument, obj)];
}

function check_sendSMS_request(req, res) : boolean {
	if (!req.body.type)
	{
		res.status(404).send('Type is missing...');
		return false;
	}

	if (req.body.type === 'login' || req.body.type === 'sign-up')
	{
		if (!req.body.code)
		{
			res.status(404).send('Phone number international code is missing...');
			return false;
		}

		if (!req.body.phoneNumber)
		{
			res.status(404).send('Phone number is missing...');
			return false;
		}

		if (!functions.checkPhoneCode(req.body.code))
		{
			res.status(404).send('Incorrect phone number international code...');
			return false;
		}

		if (!functions.checkPhoneNumber(req.body.phoneNumber))
		{
			res.status(404).send('Incorrect phone number...');
			return false;
		}
	}
	else if (req.body.type === 'sign-up')
	{
		res.status(404).send('Incorrect type...');
		return false;
	}

	return true;
}

async function getPhoneNumberWith(id) {
	const ref = collection(db, 'user');
		
	const q = query(ref, where('id', '==', id));

	let data = getDocs(q)
		.then((querySnapshot) => {
		
			if (querySnapshot.size > 0) 
			{
				let data = [];

				

				querySnapshot.forEach((userDetails) => {
					data.push( { phoneNumber : userDetails.data().phoneNumber } );

					console.log('here...', userDetails.data());
					
				})

				
				
				return Promise.resolve(data[0]);
			}
			
			return Promise.resolve(false);	
		})
	return data;
}




async function getUserDetails(id) {
	
	const ref = collection(db, 'userDetails');
		
	const q = query(ref, where('id', '==', id));
		
	console.log(id)
	let data = getDocs(q)
		.then((querySnapshot) => {
			// console.log(querySnapshot);
			if (querySnapshot.size > 0) 
			{
				let data = [];

				

				querySnapshot.forEach((userDetails) => {
					data.push( userDetails.data() );

					console.log('here...', userDetails.data());
					
				})

				
				
				return Promise.resolve(data[0]);
			}
			
			return Promise.resolve(false);	
		});
	return data;
}

async function updateUserDetailsPicture(picture_n, id) {
	const userDetailsCollection = collection(db, 'userDetails');
    const querySnapshot = await getDocs(query(userDetailsCollection, where('id', '==', id)));
	if (querySnapshot.size > 0) {
		const docRef = querySnapshot.docs[0].ref;
		
		let data = querySnapshot.docs[0].data();

		if (data.profile_image_name !== '')
			return data.profile_image_name;

		return updateDoc(docRef, {
			profile_image_name : picture_n,
			timestamp: new Date()
		});
	}
}

async function addUserDetails(name, description, id) {
	const userDetailsCollection = collection(db, 'userDetails');
    const querySnapshot = await getDocs(query(userDetailsCollection, where('id', '==', id)));

	
    if (querySnapshot.size > 0) {
        // Document with the provided id exists, update it
		
        const docRef = querySnapshot.docs[0].ref;
		if (name && description)
			return updateDoc(docRef, {
				name: name,
				description: description,
				timestamp: new Date()
			});
		else if (name)
			return updateDoc(docRef, {
				name: name,
				timestamp: new Date()
			});
		else
			return updateDoc(docRef, {
				description: description,
				timestamp: new Date()
			});
        
    } else {
        // Document with the provided id doesn't exist, create a new one
        const userDetailsDocument = doc(collection(db, 'userDetails'));
        return setDoc(userDetailsDocument, {
            id: id,
            name: (name ? name : ''),
            description: (description ? description : ''),
			profile_image_name : '',
            timestamp: new Date()
        });
        
    }
}

// async function createContactWithMessages(id1:string, id2:string) {
//     try {
//         // Reference to the 'contacts' collection
//         const contactsCollectionRef = collection(db, 'userContacts');

//         // Reference to the 'id1' document within 'contacts'
//         const id1DocumentRef = doc(contactsCollectionRef, id1);

//         // Check if 'id1' document exists
//         const id1DocumentSnapshot = await getDoc(id1DocumentRef);

//         if (!id1DocumentSnapshot.exists()) {
//             // 'id1' document doesn't exist, create it
//             await setDoc(id1DocumentRef, {});
//         }

//         // Reference to the 'id2' document within 'id1'
//         const id2DocumentRefInId1 = doc(contactsCollectionRef, id1, 'contacts', id2);

//         // Set the document with the specified fields
//         await setDoc(id2DocumentRefInId1, {
//             timestamp: new Date(),
//             status: true
//         });

//         // Reference to the 'id2' document within 'contacts'
//         const id2DocumentRef = doc(contactsCollectionRef, id2);

//         // Check if 'id2' document exists
//         const id2DocumentSnapshot = await getDoc(id2DocumentRef);

//         if (!id2DocumentSnapshot.exists()) {
//             // 'id2' document doesn't exist, create it
//             await setDoc(id2DocumentRef, {});
//         }

//         // Reference to the 'id1' document within 'id2'
//         const id1DocumentRefInId2 = doc(contactsCollectionRef, id2, 'contacts', id1);

//         // Set the document with the specified fields
//         await setDoc(id1DocumentRefInId2, {
//             timestamp: new Date(),
//             status: true
//         });

//         console.log('Contact with messages created successfully');
//     } catch (error) {
//         console.error('Error creating contact with messages:', error);
//     }
// }

async function createContactWithMessages(id1:string, id2:string) {
    try {
        // Reference to the 'contacts' collection
        const contactsCollectionRef = collection(db, 'userContacts');

        // Reference to the 'id1' document within 'contacts'
        const id1DocumentRef = doc(contactsCollectionRef, id1);

        // Check if 'id1' document exists
        const id1DocumentSnapshot = await getDoc(id1DocumentRef);

        if (!id1DocumentSnapshot.exists()) {
            // 'id1' document doesn't exist, create it
            await setDoc(id1DocumentRef, {});
        }

        // Reference to the 'id2' document within 'id1'
        const id2DocumentRefInId1 = doc(contactsCollectionRef, id1, 'contacts', id2);

        // Set the document with the specified fields
        await setDoc(id2DocumentRefInId1, {
            timestamp: new Date(),
            status: true
        });

        // Reference to the 'id2' document within 'contacts'
        const id2DocumentRef = doc(contactsCollectionRef, id2);

        // Check if 'id2' document exists
        const id2DocumentSnapshot = await getDoc(id2DocumentRef);

        if (!id2DocumentSnapshot.exists()) {
            // 'id2' document doesn't exist, create it
            await setDoc(id2DocumentRef, {});
        }

        // Reference to the 'id1' document within 'id2'
        const id1DocumentRefInId2 = doc(contactsCollectionRef, id2, 'contacts', id1);

        // Set the document with the specified fields
        await setDoc(id1DocumentRefInId2, {
            timestamp: new Date(),
            status: true
        });

        console.log('Contact with messages created successfully');
    } catch (error) {
        console.error('Error creating contact with messages:', error);
    }
}



async function getContacts(id) {
    try {
		console.log(' ID get contacts : ', id)
        const contactsCollectionRef = collection(db, `userContacts/${id}/contacts`);

        // Query to get all documents from the collection
        const querySnapshot = await getDocs(contactsCollectionRef);

        // Extract data from the query results
        const allDocuments = querySnapshot.docs.map(doc => { 
			let obj = doc.data();
			
			obj['id'] = doc.id;

			return obj;
		});

		console.log('get contacts return');
		console.log(allDocuments);
		console.log('end ----------------------------- get contacts return');
        return allDocuments;
    } catch (err) {
        // Handle errors
        console.error('Error retrieving documents:', err);
        return [];
    }
}

  
app.get('/phone-number-prefixes', (req, res) => {
	fs.readFile('./data/phone-number-prefixes.json')
		.then((data) => {
			res.send(JSON.parse(data));
		})
		.catch((error) => {
			res.status(404).send(error);
		});
});

app.post('/send-SMS', (req, res) => {
	if (!check_sendSMS_request(req, res))
		return;
	
	let rn = randomNumber();
	let phoneNumber = req.body.code + req.body.phoneNumber;

	sendSMS(phoneNumber, `Verification code: ${rn}`)
		.then(() => {
			if (req.body.type === 'sign-up')
			{
				phoneNumberExists(phoneNumber)
					.then((response) => {
						
						if (!response)
							addPhoneNumberAuth(phoneNumber, rn)
								.then((token) => {
									res.status(200).send({ token });
								})
								.catch((err) => {
									res.status(404).send('Error');
								});	
						else
							return Promise.reject();
					})
					.catch((err) => {
						res.status(404).send('Phone number exists already...');
					});
			}
			else if (req.body.type === 'login')
			{
				
				phoneNumberExists(phoneNumber)
					.then((test) => {
						console.log(test);
						if (test === false)
							return Promise.reject();

						addPhoneNumberAuth(phoneNumber, rn)
							.then((token) => {
								res.status(200).send({ token });
							})
							.catch((err) => {
								res.status(404).send('Error');
							});
						
					})
					.catch((err) => {
						res.status(404).send('Incorrect phone number');
					});
			}
			
		})
		.catch((error) => {
			res.status(404).send('Invalid phone number');
		});
});

app.post('/verify-code', (req, res) => {
	if (!req.body.code)
	{
		res.status(404).send('No international number code');
		return;
	}
	
	if (!req.body.token)
	{
		res.status(404).send('No token');
		return;
	}

	if (!req.body.type)
	{
		res.status(404);
		return;
	}

	if (req.body.type === 'sign-up') 
	{
		try {
			const ref = collection(db, 'phoneNumberAuth');
			
			const q = query(ref, where('token', '==', req.body.token), where('randomNumber', '==', parseInt(req.body.code)));
			
			
			getDocs(q)
				.then((querySnapshot) => {
					if (querySnapshot.size > 0) {
						querySnapshot.forEach((_doc) => {
							
							const data = _doc.data();
							
							
							let docRef = doc(ref, _doc.id);

							let currentTime:Date = new Date();

							let tokenTime = data.timestamp.toDate();

							let value:number = (currentTime.getTime() / 1000 / 60 - tokenTime.getTime() / 1000 / 60);
							console.log(value);
							if (value >= 5)
							{
								deleteDoc(docRef).then(() => {
								
								})
								.catch(() => {
									console.log('it failed...')
								});

								res.status(404).send('Token expired...');
								return;
							}
							
							
							
							

							let _data = addUser(data.phoneNumber, '');
							
							
							_data[1].then(() => {
								if (docRef)
								deleteDoc(docRef).then(() => {
									
								})
								.catch(() => {
									console.log('it failed...')
								});
								
								res.status(200).send({
									session_token : _data[0]
								});
							})
							.catch(() => {
								res.status(404).send('Account couln\'t be created');
							});
							
						});
					} else {
						// console.log('No matching documents found.');
						res.status(404).send('Phone number does not exist');
					}
				})
				.catch((error) => {
					console.log(error);
					res.status(404).send('idkk....');
				});
			
		} catch (err) {
			console.log(err);
			res.status(404);
		}
	}
	else if (req.body.type === 'login')
	{
		try {
			const ref = collection(db, 'phoneNumberAuth');
			
			const q = query(ref, where('token', '==', req.body.token), where('randomNumber', '==', parseInt(req.body.code)));
			
			
			getDocs(q)
				.then((querySnapshot) => {
					if (querySnapshot.size > 0) {
						querySnapshot.forEach((_doc) => {
							// Document with the specified 'code' and 'token' was found
							const data = _doc.data();
							
							
							let docRef = doc(ref, _doc.id);
							
							
							let currentTime:Date = new Date();

							let tokenTime = data.timestamp.toDate();

							let value:number = (currentTime.getTime() / 1000 / 60 - tokenTime.getTime() / 1000 / 60);
							console.log(value);
							if (value >= 5)
							{
								if (docRef)
									deleteDoc(docRef).then(() => {
										
									})
									.catch(() => {
										console.log('it failed...')
									});

								res.status(404).send('Token expired...');
								return;
							}

							let _data = updateUser(data.phoneNumber);
							
							_data.then((d) => d)
								.then((d) => {
									if (docRef)
									deleteDoc(docRef).then(() => {
									
									})
									.catch(() => {
										console.log('it failed...')
									});
									
									res.status(200).send({ session_token : d[0]});
									return d[1];
								})
								.then(() => {
									
								})
								.catch(() => {
									res.status(404).send('Something went wrong');
								})
							

						});
					} else {
						// console.log('No matching documents found.');
						res.status(404).send('Incorrect code');
					}
				})
				.catch((error) => {
					console.log(error);
					res.status(404).send('........... ok im here then');
				});
			
		} catch (err) {
			res.status(404).send('Am iii here...wtf..');
		}
	}
	else
	{
		res.status(404).send('Error');
		return;
	}
});

app.post('/is-online', (req, res) => {
	if (!req.body.token)
	{
		res.status(404).send('Not logged in...');
		return;
	}

	let result = isLoggedIn(req.body.token);

	result.then((id) => {
		if (id)
		{
			let isOnline:boolean = false;
			connectedUsers.forEach((user) => {
				if (user.id === req.body.userId)
					isOnline = true;
			});

			if (isOnline)
				res.status(200).send(true);
			else
				res.status(200).send(false);
		}
		else
		{
			res.status(404).send('Fail');
		}
	})
	.catch((err) => {
		res.status(404).send('Fail');
	});
});


// next here
app.post('/add-contact', (req, res) => {
	if (!req.body.token)
	{
		res.status(404).send('Not logged in...');
		return;
	}

	let result = isLoggedIn(req.body.token);

	result.then((id) => {
		if (id)
		{
			// phone number exists with an account... ?


			phoneNumberExists(req.body.phoneNumber)
				.then((answer) => {

					if (answer)
					{

						// verify if user self phone number
						//res.status(200).send('Phone number exists');


						getUserIdWithPhoneNumber(req.body.phoneNumber)
							.then((receiverid) => {
								if (receiverid)
								{
									
									if (receiverid !== id) // not the same user....
									{
										try {
											existsUserRequest(id, receiverid).then((n) => {

												if (n)
												{
													// res.status(404).send({ message : 'Contact request already sent...'} );
													return Promise.reject('Exists');
												}

												return Promise.resolve('');
											})
											.then(() => {
												existsUserRequest(receiverid, id).then((n) => {
													if (n)
													{
														// res.status(404).send({ message : 'You already got a request from this person...'} );
														return Promise.reject('Exists');
													}


													checkIfContactExists(id, receiverid).then((value) => {
														if (!value)
														{
															addUserRequest(id, receiverid)

															res.status(200).send({ message : 'Contact request sent sucessfully...'} );
														}
														else
														{
															res.status(404).send({ message : 'Contact already exists...'} );
														}
													})
													.catch((err) => {

													})

												})
												.catch( (err) => {
													console.log(err);
													res.status(404).send({ message : 'Contact request already sent...'} );
												});
											})
											.catch((err) => {
												console.log(err);
												res.status(404).send({ message : 'Contact request already sent...'} );
											})
										} catch(err) {
											res.status(404).send({ 
												message : 'Contact request failed...Try again later..'
											});
											
										}
									}
									else
									{
										res.status(404).send({ message : 'You cannot request yourself'});
									}
								}
								else
								{
									res.status(404).send({ message : 'Contact request failed...Try again later..'});
								}
							})
							.catch(() => {
								res.status(404).send({ message : 'Contact request failed...Try again later..'});
							});

					}
					else
						res.status(404).send({ message : 'Phone number doesn\'t have an account'});
					
				})
				.catch((err) => {
					res.status(404).send({ message : 'Contact request failed...Try again later..'});
				})
		}
		else
		{
			
			res.status(404).send('Not logged in...');
		}
	})
	.catch((err) => {
		console.log(err);
		res.status(404).send('Not logged in...');
	});
});

app.post('/validate-token', (req, res) => {
	if (!req.body.token)
	{
		res.status(404).send('Token field is empty');
		return;
	}


	
	const ref = collection(db, 'user');
			
	const q = query(ref, where('session_token', '==', req.body.token));
			
	getDocs(q).then((querySnapshot) => {
		if (querySnapshot.size > 0) 
		{
			res.status(200).send('Valid token');
			return;
		}
		
		res.status(404).send('Invalid token');
	})
	.catch(() => {
		res.status(404).send('Error');
	});
});


app.post('/user-details', (req, res) => {
	if (!req.body.token)
	{
		res.status(404).send('No session token...');
		return;
	}
	let result = isLoggedIn(req.body.token);

	result.then((value) => {
		console.log(value)
		if (value)
		{
			let id = value;

			try {
				
				getUserDetails(id).then(async (data) => {
					console.log(data);
					if (data)
					{
						try {

						
							let phoneNumber = await getPhoneNumberWith(id);
							data['phoneNumber'] = phoneNumber.phoneNumber;
							
							res.status(200).send(data);
						}
						catch(err) {
							res.status(200).send(data);
						}
						
						return;
					}
					return Promise.reject();
				})
				.catch((err) => {
					console.log(err)
					res.status(404).send('Coulnt fetch user details')
					return;
				});
				
			} catch(err) {
				res.status(404).send('Couldn\'t get data');
			}
		}
		else
			res.status(404).send('Not logged in');
	})
	.catch((err) => {
		console.log(err)
		res.status(404).send('Not logged in');
	})
});

app.post('/user-details-edit', (req, res) => {	
	if (!req.body.token)
	{
		res.status(404).send('Not logged in');
		return;
	}

	let result = isLoggedIn(req.body.token);

	result.then((value) => {
		if (value)
		{
			addUserDetails(req.body.name, req.body.description, value).then(() => {
				res.status(200).send('Details successfully updated');
			}).catch((err) => {
				console.log("[ERROR]: ", err)
				res.status(404).send('Details update failed');
			})
		}
		else
			res.status(404).send('Not logged in');
	})
	.catch(() => {
		res.status(404).send('Not logged in');
	})
});

app.post('/upload-profile-image',  (req, res, next) => {
	const form = new formidable.IncomingForm();

  	form.parse(req, (err, fields, files) => {
		if (err) 
			return res.status(500).send('Error parsing form data');
		
		
		let token = fields.token[0];
		console.log(token);
		if (!token)
		{
			

			res.status(404).send('Not logged in');
			return;
		}

		let result = isLoggedIn(token);
		
		result.then((value) => {
			if (value)
			{
				
				
				const file = files.image[0];
				const randomName = generateToken(25) + Date.now() + path.extname(file.originalFilename);
				const newPath = path.join(__dirname, '../storage/profile-images', randomName);

				updateUserDetailsPicture(randomName, value)
					.then((data) => {
						console.log(data);
						if (typeof data === 'string')
						{
							
							const newPath = path.join(__dirname, '../storage/profile-images', data);
							filesystem.rename(file.filepath, newPath, (renameError) => {
								if (renameError) {
									return res.status(500).send('Error moving uploaded file');
								}
						
									res.status(200).send({ 
										profile_image_name : data
									});	
								});

						}
						else
						{
							filesystem.rename(file.filepath, newPath, (renameError) => {
								if (renameError) {
									return res.status(500).send('Error moving uploaded file');
								}
						
									res.status(200).send({ 
										profile_image_name : randomName
									});	
								});
						}
					})
					.catch((err) => {
						console.log(err);
					});

				
			}
			else
				res.status(404).send('Not logged in');
		})
		.catch((err) => {
			console.log(err);
		})
	})	
});

app.post('/confirm-request', (req, res) => {

	if (!req.body.token)
	{
		res.status(404).send('No session token...');
		return;
	}
	let result = isLoggedIn(req.body.token);

	result.then((id) => {
		if (id)
		{
			// req.body.id
			console.log('im heree reeee', id);
			let promise1 = createContactWithMessages(id, req.body.id);
			
			let promise2 = deleteUserRequest(req.body.id, id);

			Promise.all([promise1, promise2]).then(async () => {



				let data = await getUserDetails(req.body.id);
					
				const phoneNumberData = await getPhoneNumberWith(req.body.id).catch(() => null);
			
				if (phoneNumberData) {
					data = { ...data, phoneNumber: phoneNumberData.phoneNumber };
				}

				res.status(200).send(data);
			})
			.catch(() => {
				res.status(404).send('request failed...');
			})
		}
	})
	.catch((err) => {

	});	
});

app.post('/remove-request', (req, res) => {

	if (!req.body.token)
	{
		res.status(404).send('No session token...');
		return;
	}
	let result = isLoggedIn(req.body.token);

	result.then((id) => {
		if (id)
		{
			// req.body.id


			
			let promise2 = deleteUserRequest(req.body.id, id);

			promise2.then(() => {
				res.status(200).send('request processed sucessfully...');
			})
			.catch(() => {
				res.status(404).send('request failed...');
			})
		}
	})
	.catch((err) => {

	});	
});

app.post('/get-contacts', (req, res) => {
	if (!req.body.token)
	{
		res.status(404).send('No session token...');
		return;
	}
	let result = isLoggedIn(req.body.token);

	result.then((id) => {
		if (id)
		{
			getContacts(id).then(async (documents) => {
				let toReturn = [];

				console.log('-----------------------------------------');
				console.log('Sunt aici boohooo: ' , documents);
				const promises = documents.map(async (document) => {
					if (document.id.length <= 30)
						return;

					console.log('-----------------------------------------');
					console.log('/get-contacts with document id:', document.id);
					console.log('-----------------------------------------');
					

					let data = await getUserDetails(document.id);
					console.log('-----------------------------------------');
					console.log('/get-contacts with data:', data);
					console.log('-----------------------------------------');
					const phoneNumberData = await getPhoneNumberWith(document.id).catch(() => null);
				
					if (phoneNumberData) {
						data = { ...data, phoneNumber: phoneNumberData.phoneNumber };
					}
				
					toReturn.push(data);
					  
				});
				
				// Wait for all promises to resolve before sending the response
				await Promise.all(promises);
				console.log('-----------------------------------------');
				res.status(200).send(toReturn);
			})
			.catch((err) => {
				console.log(err);
				console.log('-----------------------------------------');
				res.status(404).send('Operation failed');
			})
		}
		else
		{
			res.status(404).send('Not logged in');
		}
	})
	.catch(() => {
		res.status(404).send('Not logged in');
	});
});




app.post('/delete-message', async (req, res) => {
	if (!req.body.token) {
	  res.status(404).send('No session token...');
	  return;
	}
  
	try {
	  const senderId = await isLoggedIn(req.body.token);
	  if (senderId) {
		const messageId = req.body.messageId;
		
		// Retrieve the message from the sender's messages collection
		const senderMessageRef = doc(collection(db, 'userMessages', senderId, 'messages'), messageId);
		const senderMessageSnapshot = await getDoc(senderMessageRef);
  
		// Check if the message exists and if the sender is the actual sender of the message
		if (senderMessageSnapshot.exists() && senderMessageSnapshot.data().senderId === senderId) {
		  // Delete the message from the sender's messages collection
		  await deleteDoc(senderMessageRef);
  
		  // Also delete the message from the receiver's messages collection
		  const receiverId = senderMessageSnapshot.data().receiverId;
		  const receiverMessageRef = doc(collection(db, 'userMessages', receiverId, 'messages'), messageId);
		  await deleteDoc(receiverMessageRef);
  
		  res.status(200).send('Message deleted successfully!');
		} else {
		  res.status(400).send('Invalid message ID or you are not the sender of the message.');
		}
	  } else {
		res.status(401).send('Invalid session token.');
	  }
	} catch (error) {
	  console.error('Error deleting message:', error);
	  res.status(500).send('Internal Server Error');
	}
});

app.post('/add-message', async (req, res) => {
	if (!req.body.token) {
	  res.status(404).send('No session token...');
	  return;
	}
  
	try {
	  const senderId = await isLoggedIn(req.body.token);
	  if (senderId) {
		const receiverId = req.body.receiverId;
  
		// Check if senderId and receiverId are different
		if (senderId === receiverId) {
		  res.status(400).send('Sender and receiver IDs must be different.');
		  return;
		}
		
		const senderContactsRef = doc(collection(db, 'userContacts', senderId, 'contacts'), receiverId);
      	const receiverContactsRef = doc(collection(db, 'userContacts', receiverId, 'contacts'), senderId);

		const [senderContactsSnapshot, receiverContactsSnapshot] = await Promise.all([
			getDoc(senderContactsRef),
			getDoc(receiverContactsRef)
		]);

		if (!senderContactsSnapshot.exists() || !receiverContactsSnapshot.exists()) {
			res.status(400).send('Users must be contacts to send messages.');
			return;
		}

		const messageText = req.body.message;
		const seen = false;
		const timestamp = new Date(req.body.timestamp);
		const messageId = generateToken(60);
  
		// Add the message to the sender's messages collection with the message ID as the document name
		const senderMessagesRef = doc(collection(db, 'userMessages', senderId, 'messages'), messageId);
		await setDoc(senderMessagesRef, {
		  message: messageText,
		  seen: seen,
		  timestamp: timestamp,
		  senderId: senderId,
		  receiverId: receiverId,
		  id : messageId
		});
  
		// Add the message to the receiver's messages collection with the message ID as the document name
		const receiverMessagesRef = doc(collection(db, 'userMessages', receiverId, 'messages'), messageId);
		await setDoc(receiverMessagesRef, {
		  message: messageText,
		  seen: seen,
		  timestamp: timestamp,
		  senderId: senderId,
		  receiverId: receiverId,
		  id : messageId
		});
  
		res.status(200).send('Message added successfully!');
	  } else {
		res.status(401).send('Invalid session token.');
	  }
	} catch (error) {
	  console.error('Error adding message:', error);
	  res.status(500).send('Internal Server Error');
	}
});


async function checkIfContactExists(id1, id2) {
    try {
        
		const userContactsDocumentRef = doc(db, 'userContacts', id1);
        const contactsCollectionRef = collection(userContactsDocumentRef, 'contacts');
        // Check if 'id1' document exists
        const id1DocumentSnapshot = await getDoc(userContactsDocumentRef);

        if (id1DocumentSnapshot.exists()) {
            // 'id1' document exists, check if it has 'id2' in the 'requests' collection
            const id2DocumentSnapshot = await getDoc(doc(contactsCollectionRef, id2));

            return id2DocumentSnapshot.exists();

           
        }

        // 'id1' document doesn't exist or doesn't have 'id2' in 'requests' collection
        return false;
    } catch (error) {
        // Handle errors
        console.error('Error checking if request exists:', error);
        return false;
    }
}

app.post('/change-seen-status', async (req, res) => {
	
	if (!req.body.token) 
	{
		res.status(404).send('No session token...');
		return;
	}

	const id = await isLoggedIn(req.body.token);

	if (!id)
	{
		res.status(404).send('Not logged in...');
		return;
	}
	
	try {
		const updatePromises = req.body.messages.map(async (message) => {
			if (message.receiverId === id)
			{
				let id1 = message.senderId;
				let id2 = message.receiverId;


				let messagesCollectionRef = collection(db, 'userMessages', id1, 'messages');

				// Get a reference to the specific message
				let messageDocRef = doc(messagesCollectionRef, message.id);
				
				// Fetch the document
				let messageDocSnapshot = await getDoc(messageDocRef);
				
				if (messageDocSnapshot.exists()) {
					// Update the 'seen' property to true for the specific message
					await updateDoc(messageDocRef, { seen: true });
				}

				messagesCollectionRef = collection(db, 'userMessages', id2, 'messages');

				// Get a reference to the specific message
				messageDocRef = doc(messagesCollectionRef, message.id);
				
				// Fetch the document
				messageDocSnapshot = await getDoc(messageDocRef);
				
				if (messageDocSnapshot.exists()) {
					// Update the 'seen' property to true for the specific message
					await updateDoc(messageDocRef, { seen: true });
				}
			}
		});

		await Promise.all(updatePromises);
		res.status(200).send({ success: true, message: 'Seen status updated successfully' });
	} catch (error) {
		console.error('Error updating seen status:', error);
		res.status(500).json({ success: false, error: 'Internal server error' });
	}
});




app.get('/test', async (req, res) => {
	const senderId = req.body.messages[0].senderId;

	// Get a reference to the messages collection for the specified user
	const messagesCollectionRef = collection(db, 'userMessages', senderId, 'messages');

	// Fetch all documents from the collection
	const querySnapshot = await getDocs(messagesCollectionRef);

	// Extract the data from the documents
	const messages = querySnapshot.docs.map((doc) => doc.data());

	// Now, the 'messages' array contains all messages for the specified user
	res.status(200).send(messages);
});

server.listen(port, () => {
  	console.log(`Server is listening on port ${port}`);
	setInterval(interval, 1000 * 60 * 60);
});
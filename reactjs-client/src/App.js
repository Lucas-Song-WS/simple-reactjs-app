import React, {useState, useEffect} from 'react';
import './App.css';

function ViewPhonebook() {
	const [data, setData] = useState([{}]);
	
	useEffect(() => {
		const controller = new AbortController();
		const signal = controller.signal;
	
		fetch("http://localhost:5000/get", {signal: signal})
		.then(
			response => response.json()
		)
		.then(
			data => {
				setData(data);
			}
		)
		.catch((err) => {
			if (err.name !== 'AbortError') {
				console.log(err.name);
			}
		});
		
		return () => {
			controller.abort();
		};
	}, []);
	
	return (
		<div>
			<table>
				<thead>
					<tr>
						<td>Name</td>
						<td>Phone Number</td>
					</tr>
				</thead>
				<tbody>
					{(typeof data.contacts === 'undefined') ? (
						<tr>
							<td>Loading...</td>
						</tr>
					) : (
						data.contacts.map((contact, i) => (
							<tr key={i}>
								<td>{contact.name}</td>
								<td>{contact.phoneno}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

function ViewContactEntry() {
	const handleSubmit = (event)=> {
		event.preventDefault();
			
		fetch("http://localhost:5000/add", {
			'method':'POST', 
			headers: {'Content-Type': 'application/json'}, 
			body: JSON.stringify({"name": event.target.name.value, "phoneno": event.target.phoneno.value})
		})
		.then(
			response => {
				event.target.reset();
			}
		)
	}
	
	return (
		<form onSubmit = {handleSubmit}>
			<label>
				Name: <br/>
				<input type="text" name="name" required/>
			</label>
			<label>
				Phone Number: <br/>
				<input type="number" name="phoneno" required/>
			</label>
			<input type="submit" value="Submit" />
		</form>
	);
}

function App() {
	const [pageNo, setPageNo] = useState();
	
	useEffect(() => {
		setPageNo(JSON.parse(window.sessionStorage.getItem("pageNo")));
	}, []);

	useEffect(() => {
		window.sessionStorage.setItem("pageNo", pageNo);
	}, [pageNo]);
	
	if (pageNo === 2) {
		return (
			<div>
				<ViewContactEntry/>
				<button className="page-button" onClick={()=> setPageNo(1)}>Previous Page</button>
			</div>
		);
	}
	else {
		return (
			<div>
				<ViewPhonebook/>
				<button className="page-button" onClick={()=> setPageNo(2)}>Next Page</button>
			</div>
		);
	}	
}

export default App;

import React from "react";
import { useRef } from "react";
export default function AutoCompleteList({ countries, changeCurrentCountry, changeInputCountryFocus, selectedCountry}:any): React.ReactElement 
{
	let ref = useRef<HTMLDivElement>(null);
	
	
	return (
		countries.map((country: any, i: number) => {
			let style = selectedCountry === i ? { backgroundColor: 'white', color: 'black'} : {};
			

			let elem;

			if (selectedCountry === i)
			{
				elem = (
					<div 
						key={country.name} 
						onMouseDown={(e) => {
							changeCurrentCountry(country);
	
							changeInputCountryFocus(false);
						}}
						style = {style}
						ref = {ref}
					> 
						{country.name} 
					</div>
				);
				
				if (ref && ref.current)
				{
					
					

					ref.current.scrollIntoView({
						block: 'center',
						inline: 'center'
					});
					
				}
			}
			else
				elem = (
				<div 
					key={country.name} 
					onMouseDown={(e) => {
						changeCurrentCountry(country);

						changeInputCountryFocus(false);
					}}
				> 
					{country.name} 
				</div>
				);	

			return elem;
		})
	);
}
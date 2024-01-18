export function checkPhoneCode(s: string): boolean 
{
	let length = s.length;
	for (let i = 0; i < length; ++ i)
		if (!(s[i] >= '0' && s[i] <= '9' || s[i] === '+'))
			return false;

	return true;
}

export function checkPhoneNumber(s: string) : boolean {
	let length = s.length;
	for (let i = 0; i < length; ++ i)
		if (!(s[i] >= '0' && s[i] <= '9'))
			return false;

	return true;
}
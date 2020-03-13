function validate_md5 (md5) {
	if (typeof md5 !== 'string') {
		throw new Error('md5 must be of type string');
	}

	if (md5.length !== 32) {
		throw new Error('md5 must be of length 32');
	}

	const contains_non_hex = /[^0-9a-fA-F]/g;
	if (contains_non_hex.test(md5)) {
		throw new Error('md5 contains non-hexadecimal character');
	}
}

function validate_counting_number (number, name) {
	if (typeof number !== 'number') {
		throw new Error(`${name} must be a number`);
	}

	if (Number.isInteger(number) === false) {
		throw new Error(`${name}must be an integer`);
	}

	if (number < 0) {
		throw new Error(`${name} must be greater than zero`);
	}
}

function validate_string (string) {
	if (typeof string !== 'string') {
		throw new Error('string is not a string');
	}
}

function validate_vote_option (vote) {
	if (vote !== -1 && vote !== 0 && vote !== 1) {
		throw new Error('vote is not of the values [-1, 0, 1]');
	}
}

export {
	validate_md5,
	validate_counting_number,
	validate_string,
	validate_vote_option
};

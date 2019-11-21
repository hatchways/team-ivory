const jwt = require('jsonwebtoken');
const secret = '5a4fs5mk45u.JN6s';

export class jwtManager {
	static async validate(token) {
		return await jwt.verify(token, secret);
	}

	static async decode(token) {
		return await jwt.decode(token);
	}

	static async generateToken(user) {
		// Token w/out expiry
		return await jwt.sign(
			{
				id: user.id,
				user: user.username,
				name: user.firstName,
			},
			secret
		);
	}
}

module.exports = {
	pagination: (params) => {
		const limit = params.limit ? Number(params.limit) : 10;
		const offset = params.page && params.page > 0 ? Number(((params.page - 1) * limit)) : 0;
		return { limit, offset };
	}
};

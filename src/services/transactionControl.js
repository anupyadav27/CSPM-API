const runTransaction = async (operations) => {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const result = await operations(session);
		await session.commitTransaction();
		await session.endSession();
		return result;
	} catch (error) {
		await session.abortTransaction();
		await session.endSession();
		console.error(" Transaction failed:", error);
		throw error;
	}
};

export default runTransaction;
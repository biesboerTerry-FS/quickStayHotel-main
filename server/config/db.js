import mongoose from "mongoose";

const connectDB = async () => {
	try {
		mongoose.connection.on("connected", () =>
			console.log("Database Connected, yo")
		);
		await mongoose.connect(`${process.env.MONGODB_URI}/quickstay`);
	} catch (error) {
		console.log(error.message);
	}
};

export default connectDB;

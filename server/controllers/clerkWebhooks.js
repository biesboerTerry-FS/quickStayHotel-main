import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (request, response) => {
	// creating svix instance with clerk webhook secret
	try {
		const webHook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

		// getting headers
		const headers = {
			"svix-id": request.headers["svix-id"],
			"svix-timestamp": request.headers["svix-timestamp"],
			"svix-signature": request.headers["svix-signature"],
		};

		// verifying headers
		await webHook.verify(JSON.stringify(request.body), headers);

		// extracting data from request.body
		const { data, type } = request.body;

		// create user
		const userData = {
			_id: data.id,
			email: data.email_addresses[0].email_address,
			username: data.first_name + " " + data.last_name,
			image: data.image_url,
		};

		// switch case for different events
		switch (type) {
			case "user.created": {
				await User.create(userData);
				console.log("User created");
				break;
			}
			case "user.updated": {
				await User.findByIdAndUpdate(data._id, userData);
				console.log("User updated");
				break;
			}
			case "user.deleted": {
				await User.findByIdAndDelete(data._id);
				console.log("User deleted");
				break;
			}
			default:
				break;
		}
		response.json({
			success: true,
			message: "Webhook Received",
		});
	} catch (error) {
		console.log(error.message);
		response.json({
			success: false,
			message: error.message,
		});
	}
};

export default clerkWebhooks;

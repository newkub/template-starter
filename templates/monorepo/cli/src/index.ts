import { intro, outro, text, isCancel } from "@clack/prompts";

const runPrompt = async () => {
	intro("Welcome to Wrikka CLI");

	const name = await text({
		message: "What is your name?",
		placeholder: "John Doe",
		validate: (value) => {
			if (!value) return "Name is required!";
		},
	});

	if (isCancel(name)) {
		outro("Operation cancelled");
		return;
	}

	outro(`Hello ${name}!`);
};

runPrompt().catch(console.error);

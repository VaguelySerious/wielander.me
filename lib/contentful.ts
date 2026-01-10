import * as contentful from "contentful";

const config = {
	space: process.env.CTF_SPACE_ID || "tx3oybxuzvav",
	accessToken: process.env.CTF_CDA_ACCESS_TOKEN || "dummy-token-for-build",
};

export function createClient() {
	return contentful.createClient(config);
}

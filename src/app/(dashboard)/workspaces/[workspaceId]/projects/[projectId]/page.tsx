import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";
import { ProjectIdClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Flowtrack > Projects",
	description: "View and manage your projects here",
	icons: {
		icon: "/favicon.png",
	},
};

const ProjectIdPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	
	return <ProjectIdClient />;
};

export default ProjectIdPage;

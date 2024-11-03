import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ProjectIdSettingsClient } from "./client";

const ProjectIdSettingsPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	return <ProjectIdSettingsClient />;
};

export const metadata: Metadata = {
	title: "Project > Settings",
	description: "Manage your project settings here",
	icons: {
		icon: "/favicon.png",
	},
};

export default ProjectIdSettingsPage;

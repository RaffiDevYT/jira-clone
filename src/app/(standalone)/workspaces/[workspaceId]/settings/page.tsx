import { redirect } from "next/navigation";
import { getCurrent } from "@/features/auth/queries";

import { WorkspaceIdSettingsClient } from "./client";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Flowtrack > Settings",
	description: "View and manage your settings here",
	icons: {
		icon: "/favicon.png",
	},
};

const WorkspaceIdSettingsPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");

	return <WorkspaceIdSettingsClient />;
};

export default WorkspaceIdSettingsPage;

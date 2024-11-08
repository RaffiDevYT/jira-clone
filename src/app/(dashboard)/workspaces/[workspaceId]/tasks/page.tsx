import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

// title: "Flowtrack > Tasks"
export const metadata: Metadata = {
	title: "Flowtrack > Tasks",
	description: "View and manage your tasks here",
	icons: {
		icon: "/favicon.png",
	},
};

const TasksPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");

	return (
		<div className="h-full flex flex-col">
			<TaskViewSwitcher />
		</div>
	);
};

export default TasksPage;

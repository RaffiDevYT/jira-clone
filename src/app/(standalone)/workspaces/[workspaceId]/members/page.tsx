import { getCurrent } from "@/features/auth/queries";
import { MembersList } from "@/features/members/components/members-list";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Jira > Teams",
	description: "Manage your teams here",
	icons: {
		icon: "/favicon.png",
	},
};

const MembersPage = async () => {
	const current = await getCurrent();
	if (!current) redirect("/sign-in");
	return (
		<div className="w-full lg:max-w-xl">
			<MembersList />
		</div>
	);
};

export default MembersPage;

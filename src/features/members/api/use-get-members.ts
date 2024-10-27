import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

interface UseGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({
  workspaceId,
}: UseGetMembersProps) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const response = await client.api.members.$get({ query: { workspaceId }});

      if (!response.ok) {
        toast.error("Failed to fetch members detail");
        throw new Error("Failed to fetch members detail");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
}

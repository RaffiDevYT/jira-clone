// src/features/workspaces/hooks/use-workspace-id.ts
"use client"; // Add this line to ensure it can use client-side hooks

import { useParams } from "next/navigation";

export function useWorkspaceId() {
    const params = useParams();
    return params.workspaceId; // Make sure this matches your routing structure
}
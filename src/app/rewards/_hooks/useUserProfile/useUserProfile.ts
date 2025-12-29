import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "./useUserProfileRepository";

export function useUserProfile(userId: string | null) {
    return useQuery({
        queryKey: ['profile', userId],
        queryFn: getUserProfile
    })
}
import { useQuery } from "@tanstack/react-query";

export const useSidebarUsers = () => {
    const { error, data, isLoading } = useQuery({
        queryKey: ['sidebarUsers'],
        queryFn: () =>
            fetch(`/chat/users`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }).then((res) => res.json()),
        staleTime: 60 * 60 * 1000,
    });

    return { error, data, isLoading };
}
import { useQuery } from "@tanstack/react-query";

export const useSidebarUsers = () => {
    const url = import.meta.env.MODE === "development"? import.meta.env.VITE_API_URL:'/';

    const { error, data, isLoading } = useQuery({
        queryKey: ['sidebarUsers'],
        queryFn: () =>
            fetch(`${url}chat/users`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }).then((res) => res.json()),
        staleTime: 60 * 60 * 1000,
    });

    return { error, data, isLoading };
}
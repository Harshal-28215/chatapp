import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {

    const { error, data, isLoading } = useQuery({
        queryKey: ['userInfo'],
        queryFn: () =>
            fetch(`/auth/check`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }).then((res) => res.json()),
        staleTime: 60 * 60 * 1000,
    });

    return { error, data, isLoading };
}
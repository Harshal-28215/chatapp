import { useQuery } from "@tanstack/react-query";

export const useUserInfo = () => {

    const url = import.meta.env.VITE_API_URL;

    const { error, data, isLoading } = useQuery({
        queryKey: ['userInfo'],
        queryFn: () =>
            fetch(`${url}auth/check`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            }).then((res) => res.json()),
        staleTime: 60 * 60 * 1000,
    });

    return { error, data, isLoading };
}
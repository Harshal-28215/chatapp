import { messageType, useMyContext } from "@/context/chatappContext";
import { useEffect, useState } from "react";

export const useMessages = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false)
    const { messageIds, setMessageIds, messageRef } = useMyContext();


    useEffect(() => {
        const url = import.meta.env.VITE_API_URL;
        async function fetchMessages() {
            setIsLoading(true)
            try {
               const response = await fetch(`${url}chat/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                })
                const data = await response.json()
                if (response.ok) {
                    const newMap = new Map<string,messageType>()
                    const ids:string[] = [];

                    data.data.forEach((msg:messageType) => {
                        newMap.set(msg._id, msg);
                        ids.push(msg._id)
                    });

                    messageRef.current = newMap
                    setMessageIds(ids)
                }
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false)
            }
        }
        fetchMessages()
        return () => {
            setMessageIds([]);
        };
    }, [id]);

    return { isLoading, messageIds,messageRef };
}
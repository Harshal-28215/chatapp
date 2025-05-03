import { useMyContext } from "@/context/chatappContext";
import peer from "@/utils/peerServices";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";

function VideoCall() {
    const [params] = useSearchParams();
    const Uid = params.get("userId") || null;
    const [myStream, setMyStream] = useState<MediaStream | null>(null);
    const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
    const { socketexist } = useMyContext();

    console.log("socketexist", socketexist?.id);
    console.log("userId", Uid);



    const handleCallUser = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);

        if (stream) {
            for (const track of stream.getTracks()) {
                peer.peer?.addTrack(track, stream);
            }
        }

        const offer = await peer.getOffer();
        socketexist?.emit("callUser", { offer, from: socketexist?.id, to: Uid });
    }, [socketexist, Uid]);


    useEffect(() => {
        handleCallUser();
        return () => {
            if (myStream) {
                myStream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [handleCallUser]);

    useEffect(() => {
        if (!socketexist || !peer.peer) return;

        peer.peer.onicecandidate = (event) => {
            if (event.candidate) {
                socketexist.emit("ice-candidate", {
                    candidate: event.candidate,
                    to: Uid
                });
            }
        };

        socketexist.on("ice-candidate", ({ candidate }) => {
            if (candidate) {
                peer.peer?.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            socketexist.off("ice-candidate");
        };
    }, [socketexist, Uid]);


    const handleIncomingCall = useCallback(async ({ from, offer }: { from: string, offer: any }) => {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setMyStream(stream);

        if (stream) {
            for (const track of stream.getTracks()) {
                peer.peer?.addTrack(track, stream);
            }
        }

        const answer = await peer.getAnswer(offer);
        socketexist?.emit("callAccepted", { answer, to: from });
    }, [socketexist]);


    const handleCallAccepted = useCallback(async ({ answer }: { answer: any }) => {
        await peer.setLocalDescription(answer);
        console.log("call accepted", answer);
        if (myStream) {
            for (const track of myStream.getTracks()) {
                peer.peer?.addTrack(track, myStream);
            }
        }
    }, [myStream])

    const handleNegotiation = useCallback(async () => {
        const offer = await peer.getOffer();
        socketexist?.emit("peerNegotiation", { offer, to: Uid });
    }, [socketexist, Uid])

    const handlePeerNegotiation = useCallback(async ({ offer, from }: { offer: any, from: string }) => {
        const answer = await peer.getAnswer(offer);
        socketexist?.emit("peerNegotiationDone", { answer, to: from });
    }, [socketexist])

    const handlePeerNegotiationFinished = useCallback(async ({ answer }: { answer: any }) => {
        await peer.setLocalDescription(answer);
    }, [])

    useEffect(() => {
        peer.peer?.addEventListener("negotiationneeded", handleNegotiation);

        return () => {
            peer.peer?.removeEventListener("negotiationneeded", handleNegotiation);
        };
    }, [handleNegotiation]);


    useEffect(() => {
        peer.peer?.addEventListener("track", (event: RTCTrackEvent) => {
            const remoteStream = new MediaStream();
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
            });
            setRemoteStream(remoteStream);
        })
    }, [])

    useEffect(() => {
        socketexist?.on("incomingCall", handleIncomingCall);
        socketexist?.on("callAccepted", handleCallAccepted);
        socketexist?.on("peerNegotiation", handlePeerNegotiation);
        socketexist?.on("peerNegotiationFinished", handlePeerNegotiationFinished);

        return () => {
            socketexist?.off("incomingCall", handleIncomingCall);
            socketexist?.off("callAccepted", handleCallAccepted);
            socketexist?.off("peerNegotiation", handlePeerNegotiation);
            socketexist?.off("peerNegotiationFinished", handlePeerNegotiationFinished);

        }
    }, [handleIncomingCall, handleCallAccepted, handlePeerNegotiation, handlePeerNegotiationFinished, socketexist])

    return (
        <main>
            {myStream && (
                <video
                    width="500"
                    height="300"
                    autoPlay
                    muted={false}
                    playsInline
                    ref={(video) => {
                        if (video) video.srcObject = myStream;
                    }}
                />
            )}
            {remoteStream && (
                <video
                    width="500"
                    height="300"
                    autoPlay
                    muted={false}
                    playsInline
                    ref={(video) => {
                        if (video) video.srcObject = remoteStream;
                    }}
                />
            )}
        </main>
    )
}

export default VideoCall

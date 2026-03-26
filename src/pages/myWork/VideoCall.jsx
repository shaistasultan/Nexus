import React, { useEffect, useState, useRef } from "react";
import Peer from "peerjs";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  Phone,
  PhoneOff,
  MonitorUp,
} from "lucide-react";

const VideoCall = () => {
  const [peerId, setPeerId] = useState(""); // Your ID
  const [remotePeerIdValue, setRemotePeerIdValue] = useState(""); // ID you want to call
  const [myStream, setMyStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const peerInstance = useRef(null);
  const myVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    // 1. Initialize PeerJS (Connects to PeerJS free cloud signaling server)
    const peer = new Peer();

    peer.on("open", (id) => {
      setPeerId(id); // This is your unique ID
    });

    // 2. Setup local media (Camera/Mic)
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        if (myVideoRef.current) myVideoRef.current.srcObject = stream;

        // 3. Listen for incoming calls
        peer.on("call", (call) => {
          call.answer(stream); // Answer with our local stream
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current)
              remoteVideoRef.current.srcObject = remoteStream;
          });
        });
      });

    peerInstance.current = peer;

    return () => {
      peer.destroy();
      myStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // 4. Function to Call someone
  const callPeer = (id) => {
    const call = peerInstance.current.call(id, myStream);
    call.on("stream", (remoteStream) => {
      if (remoteVideoRef.current)
        remoteVideoRef.current.srcObject = remoteStream;
    });
  };

  // 5. UI Controls
  const toggleAudio = () => {
    myStream.getAudioTracks()[0].enabled =
      !myStream.getAudioTracks()[0].enabled;
    setIsMuted(!myStream.getAudioTracks()[0].enabled);
  };

  const toggleVideo = () => {
    myStream.getVideoTracks()[0].enabled =
      !myStream.getVideoTracks()[0].enabled;
    setIsVideoOff(!myStream.getVideoTracks()[0].enabled);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">WebRTC Frontend Call</h1>

      {/* Connection Section */}
      <div className="bg-slate-900 p-6 rounded-2xl mb-8 w-full max-w-md border border-slate-800">
        <p className="text-sm text-slate-400 mb-2">
          Your ID: <span className="text-blue-400 font-mono">{peerId}</span>
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Friend's ID"
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={remotePeerIdValue}
            onChange={(e) => setRemotePeerIdValue(e.target.value)}
          />
          <button
            onClick={() => callPeer(remotePeerIdValue)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
          >
            <Phone size={18} /> Call
          </button>
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl">
        {/* Local Video */}
        <div className="relative bg-slate-900 aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <video
            ref={myVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-xs">
            You
          </div>
        </div>

        {/* Remote Video */}
        <div className="relative bg-slate-900 aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded-lg text-xs">
            Remote User
          </div>
          {!remoteVideoRef.current?.srcObject && (
            <div className="absolute inset-0 flex items-center justify-center text-slate-500">
              Waiting for connection...
            </div>
          )}
        </div>
      </div>

      {/* Floating Controls */}
      <div className="fixed bottom-10 flex gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl">
        <button
          onClick={toggleAudio}
          className={`p-4 rounded-full ${isMuted ? "bg-red-500" : "bg-slate-700 hover:bg-slate-600"}`}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-4 rounded-full ${isVideoOff ? "bg-red-500" : "bg-slate-700 hover:bg-slate-600"}`}
        >
          {isVideoOff ? <VideoOff /> : <Video />}
        </button>

        <button
          onClick={() => window.location.reload()}
          className="p-4 rounded-full bg-red-600 hover:bg-red-700"
        >
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default VideoCall;

import React, { useEffect, useRef } from 'react';
import Peer from 'peerjs';
import './App.css';

const App = () => {
  const myVideoRef = useRef();
  const partnerVideoRef = useRef();
  const peer = new Peer(undefined, {
    host: '/',
    port: '5000',
    path: '/peerjs',
  });

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((stream) => {
        myVideoRef.current.srcObject = stream;

        peer.on('call', (incomingCall) => {
          incomingCall.answer(stream);
          incomingCall.on('stream', (partnerStream) => {
            partnerVideoRef.current.srcObject = partnerStream;
          });
        });
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }, []);

  const callPeer = () => {
    const partnerId = prompt('Enter your friend\'s ID');
    if (partnerId) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          const call = peer.call(partnerId, stream);
          call.on('stream', (partnerStream) => {
            partnerVideoRef.current.srcObject = partnerStream;
          });
        })
        .catch((error) => {
          console.error('Error accessing media devices:', error);
        });
    }
  };

  return (
    <div className="App">
      <div className="video-container">
        <video ref={myVideoRef} className="my-video" muted autoPlay></video>
        <video ref={partnerVideoRef} className="partner-video" autoPlay></video>
      </div>
      <button className="call-button" onClick={callPeer}>
        Call a Friend
      </button>
    </div>
  );
};

export default App;

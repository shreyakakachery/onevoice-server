import { AssemblyAI } from "assemblyai";
import { WebSocketServer } from "ws";

// Create a WebSocket server that handles connections from frontend
export function createTranscriptionSocket(server) {
  // attaches to existing http seerver, shares same port, accepts ws connection
  const wss = new WebSocketServer({ server });

  // new client and api credentials
  const assemblyClient = new AssemblyAI({
    apiKey: "YOUR API KEY",
  });

  // event listener, when frontend user connects creates a transcriber
  wss.on("connection", (ws) => {
    console.log("Client connected");

    // Create a transcriber for this connection
    const transcriber = assemblyClient.realtime.transcriber({
      sampleRate: 16000,
    });

    // Connect to AssemblyAI service
    transcriber.connect().then(() => {
      ws.send(
        JSON.stringify({
          type: "connected",
        })
      );
    });

    // Handle audio data from frontend
    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      if (data.type === "audio") {
        // Convert base64 to binary if needed
        const audioBuffer = Buffer.from(data.audio, "base64");
        transcriber.sendAudio(audioBuffer);
      }
    });

    // Forward AssemblyAI events to the frontend
    transcriber.on("transcript", (transcript) => {
      console.log("🔹 Received from AssemblyAI:", transcript);
    
      if (transcript.message_type === "FinalTranscript") { 
        console.log("Sending final transcript:", transcript.text);
        
        ws.send(
          JSON.stringify({
            type: "transcript",
            data: transcript.text,  
          })
        );
      }
    });
    

    transcriber.on("error", (error) => {
      ws.send(
        JSON.stringify({
          type: "error",
          message: error.message,
        })
      );
    });

    // Handle client disconnect, closes API
    ws.on("close", () => {
      console.log("Client disconnected");
      transcriber.close();
    });
  });
}

import { AssemblyAI } from "assemblyai";
import { WebSocketServer } from "ws";

// Create a WebSocket server that handles connections from frontend
export function createTranscriptionSocket(server) {
  const wss = new WebSocketServer({ server });

  const assemblyClient = new AssemblyAI({
    apiKey: "104e9aa2224f41d18dc466fbebc332a4",
  });

  wss.on("connection", (ws) => {
    console.log("Client connected");

    // Create a transcriber for this connection
    const transcriber = assemblyClient.realtime.transcriber({
      sampleRate: 16000,
    });

    // Forward AssemblyAI events to the frontend
    transcriber.on("transcript", (transcript) => {
      console.log("🔹 Received from AssemblyAI:", transcript);
    
      if (transcript.message_type === "FinalTranscript") { 
        console.log("📤 Sending final transcript:", transcript.text);
        
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

    // Handle client disconnect
    ws.on("close", () => {
      console.log("Client disconnected");
      transcriber.close();
    });
  });
}

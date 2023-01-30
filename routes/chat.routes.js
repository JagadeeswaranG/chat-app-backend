
const chatSocketRouter = (io) => {
  io.on("connection",(socket) => {
    console.log("socket:", socket );
    console.log("User connected", socket.id);
  
   
    socket.on("join-room", (data) => {
      socket.join(data);
      console.log(`user ${socket.id} has joined the room ${data}`);
  
    });
  
    socket.on("send-message", (data) => {    
      socket.to(data.room).emit("receive-message", data);
    });
  
    socket.on("disconnect", () => {
      console.log("User Disconnected:", socket.id);
    })
  })

}

module.exports = chatSocketRouter;

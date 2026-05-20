export function configureSocket(io) {
  io.on("connection", (socket) => {
    socket.on("booking:join", (bookingId) => {
      socket.join(String(bookingId));
    });

    socket.on("rider:location", ({ bookingId, location, etaMinutes }) => {
      io.to(String(bookingId)).emit("delivery:update", { currentLocation: location, etaMinutes });
    });
  });
}

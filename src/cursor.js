if (typeof document !== "undefined") {
  const dotSize = 4; // Size of the dot
  const trailLength = 50; // Number of trail points
  const trailSpacing = 5; // Spacing between trail points

  let trail = [];

  function draw() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the trail points
    for (let i = 0; i < trail.length; i++) {
      const alpha = i / trail.length;
      const size = dotSize * (1 - alpha);

      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();
    }

    // Draw the cursor dot
    const dotX = trail[0].x;
    const dotY = trail[0].y;

    ctx.beginPath();
    ctx.arc(dotX, dotY, dotSize, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();

    // Remove the oldest trail point if the trail is too long
    if (trail.length >= trailLength) {
      trail.pop();
    }

    // Add the current cursor position to the trail
    trail.unshift({ x: dotX, y: dotY });

    requestAnimationFrame(draw);
  }

  // Resize the canvas to fill the window
  function resizeCanvas() {
    const canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Call the resize function initially
  resizeCanvas();

  // Call the resize function whenever the window is resized
  window.addEventListener("resize", resizeCanvas);

  // Start the drawing loop
  draw();
}

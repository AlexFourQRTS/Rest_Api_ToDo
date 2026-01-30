const consoles = ['nes', 'megadrive', 'snes', 'gba', 'gbc', 'psx', 'atari'];

const htmlHello = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <title>Retro Games API</title>
      <style>
          body { background: #121212; color: #00ff00; font-family: monospace; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .container { border: 2px dashed #00ff00; padding: 2rem; background: #1a1a1a; max-width: 600px; width: 90%; }
          h1 { color: #ff00ff; }
          .status { background: #004400; padding: 5px; border-radius: 4px; }
          .console-tag { display: inline-block; background: #333; color: #fff; padding: 2px 8px; margin: 2px; border-radius: 3px; }
          a { color: #00ffff; text-decoration: none; }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>🕹️ Retro Games API</h1>
          <p><span class="status">● SYSTEM ONLINE</span> v1.0.0</p>
          <hr style="border: 1px solid #333">
          <h3>Available Endpoints:</h3>
          <ul>
              <li>📡 Consoles: <a href="/consoles"><code>/consoles</code></a></li>
              <li>🎮 Games: <code>/consoles/:id/games</code></li>
              
          </ul>
          <h3>Supported Systems:</h3>
          <div>
              ${consoles.map(c => `<span class="console-tag">${c.toUpperCase()}</span>`).join('')}
          </div>
          <p style="margin-top: 2rem; font-size: 0.8rem; color: #666;">
              Server Time: ${new Date().toLocaleString()}
          </p>
      </div>
  </body>
  </html>
`;

module.exports = htmlHello;
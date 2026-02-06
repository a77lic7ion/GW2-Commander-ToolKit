// Preload script for Electron
// This runs in the renderer process but has access to Node.js APIs

const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods to the renderer process
contextBridge.exposeInMainWorld("electronAPI", {
  platform: process.platform,
  isElectron: true,
  runScript: (scriptPath) => ipcRenderer.invoke("run-script", scriptPath),
});

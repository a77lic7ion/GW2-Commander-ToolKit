const { app, BrowserWindow, shell, ipcMain, clipboard } = require("electron");
const path = require("path");

// Native Script Logic Data
const SCRIPT_DATA = {
  psna: () => {
    const now = new Date();
    const hour = now.getUTCHours();
    const dw = now.getUTCDay();
    const pdw = (dw - 1 + 7) % 7;

    const psna = [
      "[&BIkHAAA=][&BDoBAAA=][&BO4CAAA=][&BC0AAAA=][&BIUCAAA=][&BCECAAA=]",
      "[&BIcHAAA=][&BEwDAAA=][&BNIEAAA=][&BKYBAAA=][&BIMCAAA=][&BA8CAAA=]",
      "[&BH8HAAA=][&BEgAAAA=][&BKgCAAA=][&BBkAAAA=][&BGQCAAA=][&BIMBAAA=]",
      "[&BH4HAAA=][&BMIBAAA=][&BP0CAAA=][&BKYAAAA=][&BDgDAAA=][&BPEBAAA=]",
      "[&BKsHAAA=][&BE8AAAA=][&BP0DAAA=][&BIMAAAA=][&BF0GAAA=][&BOcBAAA=]",
      "[&BJQHAAA=][&BMMCAAA=][&BJsCAAA=][&BNUGAAA=][&BHsBAAA=][&BNMAAAA=]",
      "[&BH8HAAA=][&BLkCAAA=][&BBEDAAA=][&BJIBAAA=][&BEICAAA=][&BBABAAA=]",
    ];

    const output = hour >= 8 ? psna[dw] : psna[pdw];
    clipboard.writeText(output);
    return true;
  },
  masterdiver: () => {
    clipboard.writeText(
      "[&BAAEAAA=][&BKEAAAA=][&BCwAAAA=][&BCMAAAA=][&BOEBAAA=][&BJAAAAA=][&BOcFAAA=][&BEwGAAA=][&BD0CAAA=][&BI0GAAA=]",
    );
    return true;
  },
};

ipcMain.handle("run-script", async (event, scriptName) => {
  const action = SCRIPT_DATA[scriptName.toLowerCase().replace(".bat", "")];
  if (action) return action();
  return false;
});

// Handle creating/removing shortcuts on Windows when installing/uninstalling
// Handle creating/removing shortcuts on Windows when installing/uninstalling
// if (require("electron-squirrel-startup")) {
//   app.quit();
// }

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    icon: path.join(__dirname, "../logo.png"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    titleBarStyle: "default",
    backgroundColor: "#0f172a",
    show: false,
    autoHideMenuBar: true,
  });

  // Load the app
  if (process.env.NODE_ENV === "development") {
    const devUrl = process.env.ELECTRON_DEV_URL || "http://localhost:3000";
    mainWindow.loadURL(devUrl);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  // Show window when ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

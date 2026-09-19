const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

let mainWindow;

// Determine if running in development or production
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
    title: 'MedScript Analytics',
    backgroundColor: '#0f172a',
    show: false,
    autoHideMenuBar: false,
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built files
    // Try multiple possible locations for the dist folder
    const possiblePaths = [
      path.join(__dirname, '..', 'dist', 'index.html'),
      path.join(process.resourcesPath || '', 'dist', 'index.html'),
      path.join(app.getAppPath(), 'dist', 'index.html'),
    ];

    let indexPath = null;
    for (const p of possiblePaths) {
      try {
        require('fs').accessSync(p);
        indexPath = p;
        break;
      } catch (e) {
        // continue to next path
      }
    }

    if (indexPath) {
      mainWindow.loadFile(indexPath);
    } else {
      // Fallback: show error
      mainWindow.loadURL(`data:text/html;charset=utf-8,
        <html>
          <body style="background:#0f172a;color:white;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
            <div style="text-align:center;">
              <h1>MedScript Analytics</h1>
              <p>Application files not found. Please rebuild the application.</p>
            </div>
          </body>
        </html>
      `);
    }
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Create custom menu
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Search',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-search');
          }
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectall' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forcereload' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About MedScript Analytics',
              message: 'MedScript Analytics v1.0.0',
              detail: 'Doctor Prescription Research Tool\n\nOntario, Canada\n\nThis application runs entirely offline.\nNo internet connection required.\n\nFor informational purposes only.',
              buttons: ['OK']
            });
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

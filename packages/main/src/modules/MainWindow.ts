interface IWindowService {
    setMainWindow(window: Electron.BrowserWindow): void;
    getMainWindow(): Electron.BrowserWindow | null;
}

class WindowService implements IWindowService {
    private mainWindow: Electron.BrowserWindow | null = null;

    setMainWindow(window: Electron.BrowserWindow) {
        this.mainWindow = window;
    }

    getMainWindow() {
        if (this.mainWindow === null || this.mainWindow.isDestroyed())
            throw new Error('Main window is not set or has been destroyed.');

        return this.mainWindow;
    }
}

export const windowService = new WindowService();

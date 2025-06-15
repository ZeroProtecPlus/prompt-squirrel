import { app, nativeTheme } from "electron";
import { Ok } from "../common/ipc.response.js";
import { windowService } from "../modules/MainWindow.js";

class ElectronController implements IElectronController {
    async setPinnedWindow(pinned: boolean): Promise<IPCResponse<void>> {
        const mainWindow = windowService.getMainWindow();

        mainWindow.setAlwaysOnTop(pinned);

        return Ok();
    }

    async setTheme(theme: Theme): Promise<IPCResponse<void>> {
        if (theme === 'green') 
            nativeTheme.themeSource = 'light';
        else 
            nativeTheme.themeSource = theme;

        return Ok();
    }
}

export const electronController = new ElectronController();
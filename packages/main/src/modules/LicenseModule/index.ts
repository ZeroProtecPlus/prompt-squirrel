import { app } from 'electron';
import { AppModule } from '../../AppModule.js';
import { ModuleContext } from '../../ModuleContext.js';
import { getLicenseService } from './license.service.js';

export class LicenseModule implements AppModule {
    async enable({ app }: ModuleContext): Promise<void> {
        await app.whenReady();
        const licenseService = getLicenseService();
        
        // Verificar licencia al inicio
        const isValid = await licenseService.validateLicense();
        if (!isValid) {
            await licenseService.showActivationDialog();
        }
    }
}

export function licenseModule() {
    return new LicenseModule();
}

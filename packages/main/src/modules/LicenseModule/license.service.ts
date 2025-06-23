import { dialog } from 'electron';
import Store from 'electron-store';
import { machineIdSync } from 'node-machine-id';

interface LicenseInfo {
    key: string;
    hardwareId: string;
    activationDate: string;
}

class LicenseService {
    private store: Store<{ license: LicenseInfo | null }>;
    private readonly API_URL = 'https://your-license-service.netlify.app/api';

    constructor() {
        this.store = new Store({
            name: 'license-data',
            encryptionKey: 'your-encryption-key'
        });
    }

    private async fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }) {
        const { timeout = 8000, ...fetchOptions } = options;
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            throw error;
        }
    }

    async validateLicense(): Promise<boolean> {
        const storedLicense = this.store.get('license');
        if (!storedLicense) return false;

        try {
            const response = await this.fetchWithTimeout(`${this.API_URL}/licenses/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: storedLicense.key,
                    hardwareId: storedLicense.hardwareId
                })
            });

            if (!response.ok) return false;
            const data = await response.json();
            return data.isValid;
        } catch (error) {
            // Si hay un error de conexión, validamos offline
            return this.validateOffline(storedLicense);
        }
    }

    private validateOffline(license: LicenseInfo): boolean {
        const currentHardwareId = this.getHardwareId();
        return license.hardwareId === currentHardwareId;
    }

    private getHardwareId(): string {
        return machineIdSync(true);
    }

    async activateLicense(key: string): Promise<boolean> {
        const hardwareId = this.getHardwareId();

        try {
            const response = await this.fetchWithTimeout(`${this.API_URL}/licenses/activate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, hardwareId })
            });

            if (!response.ok) {
                throw new Error('Invalid license key');
            }

            const license = await response.json();
            this.store.set('license', {
                key,
                hardwareId,
                activationDate: new Date().toISOString()
            });

            return true;
        } catch (error) {
            console.error('License activation failed:', error);
            return false;
        }
    }

    async showActivationDialog(): Promise<void> {
        const { response } = await dialog.showMessageBox({
            type: 'info',
            title: 'Activación de Licencia',
            message: 'Este software requiere una licencia válida para funcionar.',
            buttons: ['Activar', 'Salir'],
            defaultId: 0,
            cancelId: 1
        });

        if (response === 0) {
            const { response: keyResponse } = await dialog.showMessageBox({
                type: 'question',
                title: 'Ingresar Clave de Licencia',
                message: 'Por favor ingrese su clave de licencia:',
                buttons: ['OK', 'Cancelar'],
                defaultId: 0,
                cancelId: 1,
                promptLabels: ['Clave de Licencia']
            });

            if (keyResponse === 0) {
                // Aquí deberías mostrar un input dialog real
                // Por ahora usamos un valor de ejemplo
                const success = await this.activateLicense("example-key");
                if (!success) {
                    await dialog.showMessageBox({
                        type: 'error',
                        title: 'Error de Activación',
                        message: 'La clave de licencia no es válida.'
                    });
                    app.quit();
                }
            } else {
                app.quit();
            }
        } else {
            app.quit();
        }
    }
}

let licenseService: LicenseService | null = null;

export function getLicenseService(): LicenseService {
    if (!licenseService) {
        licenseService = new LicenseService();
    }
    return licenseService;
}

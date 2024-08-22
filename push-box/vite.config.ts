import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/

export default defineConfig(({command, mode}) => {
        return {
            plugins: [react()],
            server: {
                host: '0.0.0.0',
                port: 8000,
                hmr: {
                    // overlay: false,
                }
            },
            base: 'push-box/push-box/dist/',
            resolve: {
                alias: {
                    '@': path.resolve(__dirname, './src'),
                    '@images': path.resolve(__dirname, './images')
                }
            }
        }
    }
);

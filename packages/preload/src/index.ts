import {sha256sum} from './nodeCrypto.js';
import {versions} from './versions.js';
import {ipcRenderer, contextBridge} from 'electron';
import {getSystemInfo, subscribeToSystemInfo} from './systemInfo.js';

function send(channel: string, message: string) {
  return ipcRenderer.invoke(channel, message);
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  sha256sum,
  versions,
  send,
  getSystemInfo,
  subscribeToSystemInfo,
});

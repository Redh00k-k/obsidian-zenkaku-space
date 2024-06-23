import { App, Plugin, PluginSettingTab, Setting, debounce} from "obsidian";
import {
  highlightSpecialChars
} from "@codemirror/view";

import {ZenkakuSpaceSettingsTab} from "./zenkakuSpace_settingsTab";


interface Settings {
  backgroundColor: string;
  borderColor: string;
}

const DEFAULT_SETTINGS: Settings = {
  backgroundColor: "#C8C8C865",
  borderColor: "#FAA21465"
};

export default class ZenkakuSpacePlugin extends Plugin {
  settings: Settings;
  classList: string[] = [];

  async onload() {
    console.log("[zenkaku] Loading plugin");
    await this.loadSettings();
    this.addSettingTab(new ZenkakuSpaceSettingsTab(this.app, this));
    
    this.app.workspace.onLayoutReady(async () => {
      this.registerExtenstion();
      this.addColorStyle();
    })  
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  registerExtenstion(): void {
    console.log("[zenkaku] Register extenstion");

    this.classList = [];
    this.registerEditorExtension(highlightSpecialChars({
        render: (code, desc, ph) => {
          const span = document.createElement("span");
          span.textContent = "\u3000";
          span.className = "cm-zenkaku-space";
          return span;
        },  
        specialChars: /[\u3000]/g,
      }));
  }

  addColorStyle() {
    let colorStyleEl = document.getElementById('zenkakuColorPluginStyles');

    if (!colorStyleEl) {
      colorStyleEl = this.app.workspace.containerEl.createEl('style');
      colorStyleEl.id = 'zenkakuColorPluginStyles';
    }

    colorStyleEl.innerHTML = `.cm-zenkaku-space{ background-color: ${this.settings.backgroundColor}; border: 1px solid ${this.settings.borderColor}; }`;
  }

  removeColorStyle(){
    let colorStyleEl = document.getElementById('zenkakuColorPluginStyles');
    if (!colorStyleEl) {
      return;
    }

    colorStyleEl.remove();
  }

  applyColorStyle(){
      console.debug("[zenkaku] Apply color settings.");
      this.settings = Object.assign(
            {},
            this.settings,
            this.loadData(),
        );
        this.removeColorStyle();
        this.addColorStyle();
  }

  public onExternalSettingsChange = debounce(
      this.applyColorStyle,
      200,
      true,
  );
}

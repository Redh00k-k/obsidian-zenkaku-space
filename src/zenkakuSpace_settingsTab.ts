import { App, PluginSettingTab, Setting,debounce} from "obsidian";

import ZenkakuSpacePlugin from "./main";

interface Settings {
  backgroundColor: string;
  borderColor: string;
}

export class ZenkakuSpaceSettingsTab extends PluginSettingTab {
  plugin: ZenkakuSpacePlugin;
  newSettings: Settings;

  constructor(app: App, plugin: ZenkakuSpacePlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  
  display(): void {
    const {containerEl} = this;
    containerEl.empty();

    const backgroundColor = new Setting(containerEl);
    backgroundColor
    .setName("Background color")
    .setDesc("Enter a background color (HEXA/RGB)")
    .addText((tc) =>
      tc
        .setPlaceholder("e.g. #123456FF")
        .setValue(this.plugin.settings.backgroundColor)
        .onChange(async (value) => {
          this.plugin.settings.backgroundColor = value;
          await this.plugin.saveSettings();
          this.plugin.applyColorStyle();
        })
    );

    const borderColor = new Setting(containerEl);
    borderColor
    .setName("Boarder color")
    .setDesc("Enter a border color (HEXA/RGB)")
    .addText((tc) =>
      tc
        .setPlaceholder("e.g. #123456FF")
        .setValue(this.plugin.settings.borderColor)
        .onChange(async (value) => {
          this.plugin.settings.borderColor = value;
          await this.plugin.saveSettings();
          this.plugin.applyColorStyle();
        })
    );
  }
}
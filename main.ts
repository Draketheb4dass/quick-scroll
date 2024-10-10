import { App, MarkdownView, View, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface MyPluginSettings {
    mySetting: string;
}

const DEFAULT_SETTINGS: MyPluginSettings = {
    mySetting: 'default'
};

let globalMarkdownView: MarkdownView | null = null;

export default class HelloWorldPlugin extends Plugin {
    settings: MyPluginSettings;
    private scrollButton: HTMLButtonElement;

    async onload() {
        console.log('loading plugin');
        await this.loadSettings();

        this.scrollButton = this.createScrollButton();

        // Add the button to the Obsidian editor container
        document.body.appendChild(this.scrollButton);

        // Add an event listener to scroll down when the button is clicked
        this.scrollButton.addEventListener("click", this.scrollToBottom.bind(this));

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new SampleSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt);
        });

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
    }

    onunload() {
        console.log('unloading plugin');
        if (this.scrollButton) {
            this.scrollButton.remove();
        }
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    createScrollButton() {
        // Type assertion to specify that this is an HTMLButtonElement
        this.scrollButton = document.createElement('button') as HTMLButtonElement;

        this.scrollButton.innerText = '↓'; // Down arrow symbol
        this.scrollButton.style.position = 'fixed';
        this.scrollButton.style.bottom = '20px'; // Space from bottom
        this.scrollButton.style.left = '50%'; // Center horizontally
        this.scrollButton.style.transform = 'translateX(-50%)'; // Align center
        this.scrollButton.style.zIndex = '1000';

        // Apply styles for position, size, background, and shadow
        this.scrollButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

        // Circular shape
        this.scrollButton.style.width = '30px';
        this.scrollButton.style.height = '30px';
        this.scrollButton.style.borderRadius = '40%';
        this.scrollButton.style.backgroundColor = '#007BFF'; // Blue background
        this.scrollButton.style.color = 'white';

        return this.scrollButton;
    }

    private scrollToBottom = async () => {
        const markdownView = this.getCurrentViewOfType();
        if (markdownView) {
            const file = this.app.workspace.getActiveFile();
            const content = await (this.app as any).vault.cachedRead(file);
            const lines = content.split('\n');
            let numberOfLines = lines.length;

            // In preview mode, don't count empty lines at the end
            if (markdownView.getMode() === 'preview') {
                while (numberOfLines > 0 && lines[numberOfLines - 1].trim() === '') {
                    numberOfLines--;
                }
            }
            markdownView.currentMode.applyScroll(numberOfLines - 1);
        }
    };

    public getCurrentViewOfType() {
        // Get the current active view
        let markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);

        // To distinguish whether the current view is hidden or not markdownView
        const currentView = this.app.workspace.getActiveViewOfType(View) as MarkdownView;

        // Solve the problem of closing always focus new tab setting
        if (markdownView !== null) {
            globalMarkdownView = markdownView;
        } else {
            // Fix the plugin shutdown problem when the current view is not exist
            if (currentView == null || currentView?.file?.extension === "md") {
                markdownView = globalMarkdownView;
            }
        }
        return markdownView;
    }
}

class SampleSettingTab extends PluginSettingTab {
    plugin: HelloWorldPlugin;

    constructor(app: App, plugin: HelloWorldPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Setting #1')
            .setDesc("It's a secret")
            .addText(text => text
                .setPlaceholder('Enter your secret')
                .setValue(this.plugin.settings.mySetting)
                .onChange(async (value) => {
                    this.plugin.settings.mySetting = value;
                    await this.plugin.saveSettings();
                }));
    }
}

import { App, MarkdownView, View, Plugin, PluginSettingTab, Setting } from 'obsidian';

interface QuickScrollSettings {
    buttonPosition: 'left' | 'center' | 'right';
    buttonSize: number;
    buttonColor: string;
}

const DEFAULT_SETTINGS: QuickScrollSettings = {
    buttonPosition: 'center',
    buttonSize: 30,
    buttonColor: '#007BFF'
};

let globalMarkdownView: MarkdownView | null = null;

export default class QuickScrollPlugin extends Plugin {
    settings: QuickScrollSettings;
    public scrollButton: HTMLButtonElement;

    async onload() {
        console.log('Loading Quick Scroll plugin');
        await this.loadSettings();

        this.scrollButton = this.createScrollButton();

        // Add the button to the Obsidian editor container
        document.body.appendChild(this.scrollButton);

        // Add an event listener to scroll down when the button is clicked
        this.scrollButton.addEventListener("click", this.scrollToBottom.bind(this));

        // This adds a settings tab so the user can configure various aspects of the plugin
        this.addSettingTab(new QuickScrollSettingTab(this.app, this));

        // If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
        // Using this function will automatically remove the event listener when this plugin is disabled.
        this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
            console.log('click', evt);
        });

    }

    onunload() {
        console.log('Unloading Quick Scroll plugin');
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
        this.scrollButton = document.createElement('button') as HTMLButtonElement;

        this.scrollButton.innerText = '↓'; // Down arrow symbol
        
        // Add base CSS class
        this.scrollButton.classList.add('quick-scroll-button');
        
        // Add position class
        this.scrollButton.classList.add(`position-${this.settings.buttonPosition}`);
        
        // Add size class
        this.scrollButton.classList.add(`size-${this.settings.buttonSize}`);
        
        // Set background color via CSS custom property for dynamic updates
        this.scrollButton.style.setProperty('--button-color', this.settings.buttonColor);

        return this.scrollButton;
    }

    public scrollToBottom = async () => {
        try {
            const markdownView = this.getCurrentViewOfType();
            if (markdownView) {
                const file = this.app.workspace.getActiveFile();
                if (!file) {
                    console.log('No active file found');
                    return;
                }
                
                const content = await this.app.vault.cachedRead(file);
                const lines = content.split('\n');
                let numberOfLines = lines.length;

                // In preview mode, don't count empty lines at the end
                if (markdownView.getMode() === 'preview') {
                    while (numberOfLines > 0 && lines[numberOfLines - 1].trim() === '') {
                        numberOfLines--;
                    }
                }
                markdownView.currentMode.applyScroll(numberOfLines - 1);
            } else {
                console.log('No markdown view found');
            }
        } catch (error) {
            console.error('Error scrolling to bottom:', error);
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

class QuickScrollSettingTab extends PluginSettingTab {
    plugin: QuickScrollPlugin;

    constructor(app: App, plugin: QuickScrollPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('Button Position')
            .setDesc('Choose where to position the scroll button')
            .addDropdown(dropdown => dropdown
                .addOption('left', 'Left')
                .addOption('center', 'Center')
                .addOption('right', 'Right')
                .setValue(this.plugin.settings.buttonPosition)
                .onChange(async (value: 'left' | 'center' | 'right') => {
                    this.plugin.settings.buttonPosition = value;
                    await this.plugin.saveSettings();
                    // Update position class
                    if (this.plugin.scrollButton) {
                        this.plugin.scrollButton.classList.remove('position-left', 'position-center', 'position-right');
                        this.plugin.scrollButton.classList.add(`position-${value}`);
                    }
                }));

        new Setting(containerEl)
            .setName('Button Size')
            .setDesc('Set the size of the scroll button in pixels')
            .addSlider(slider => slider
                .setLimits(20, 50, 5)
                .setValue(this.plugin.settings.buttonSize)
                .setDynamicTooltip()
                .onChange(async (value) => {
                    this.plugin.settings.buttonSize = value;
                    await this.plugin.saveSettings();
                    // Update size class
                    if (this.plugin.scrollButton) {
                        this.plugin.scrollButton.classList.remove('size-20', 'size-25', 'size-30', 'size-35', 'size-40', 'size-45', 'size-50');
                        this.plugin.scrollButton.classList.add(`size-${value}`);
                    }
                }));

        new Setting(containerEl)
            .setName('Button Color')
            .setDesc('Choose the color of the scroll button')
            .addColorPicker(colorPicker => colorPicker
                .setValue(this.plugin.settings.buttonColor)
                .onChange(async (value) => {
                    this.plugin.settings.buttonColor = value;
                    await this.plugin.saveSettings();
                    // Update button color via CSS custom property
                    if (this.plugin.scrollButton) {
                        this.plugin.scrollButton.style.setProperty('--button-color', value);
                    }
                }));
    }
}

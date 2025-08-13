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

        // When registering intervals, this function will automatically clear the interval when the plugin is disabled.
        this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
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
        // Type assertion to specify that this is an HTMLButtonElement
        this.scrollButton = document.createElement('button') as HTMLButtonElement;

        this.scrollButton.innerText = '↓'; // Down arrow symbol
        this.scrollButton.style.position = 'fixed';
        this.scrollButton.style.bottom = '20px'; // Space from bottom
        
        // Apply position based on settings
        if (this.settings.buttonPosition === 'left') {
            this.scrollButton.style.left = '20px';
            this.scrollButton.style.transform = 'none';
        } else if (this.settings.buttonPosition === 'right') {
            this.scrollButton.style.right = '20px';
            this.scrollButton.style.transform = 'none';
        } else {
            this.scrollButton.style.left = '50%'; // Center horizontally
            this.scrollButton.style.transform = 'translateX(-50%)'; // Align center
        }
        
        this.scrollButton.style.zIndex = '1000';

        // Apply styles for position, size, background, and shadow
        this.scrollButton.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.1)';

        // Circular shape with configurable size
        this.scrollButton.style.width = `${this.settings.buttonSize}px`;
        this.scrollButton.style.height = `${this.settings.buttonSize}px`;
        this.scrollButton.style.borderRadius = '50%';
        this.scrollButton.style.backgroundColor = this.settings.buttonColor;
        this.scrollButton.style.color = 'white';
        this.scrollButton.style.border = 'none';
        this.scrollButton.style.cursor = 'pointer';
        this.scrollButton.style.fontSize = '16px';
        this.scrollButton.style.fontWeight = 'bold';
        
        // Add CSS class for styling
        this.scrollButton.classList.add('quick-scroll-button');

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
                    // Recreate button with new position
                    if (this.plugin.scrollButton) {
                        this.plugin.scrollButton.remove();
                    }
                    this.plugin.scrollButton = this.plugin.createScrollButton();
                    document.body.appendChild(this.plugin.scrollButton);
                    // Reattach click event listener
                    this.plugin.scrollButton.addEventListener("click", this.plugin.scrollToBottom.bind(this.plugin));
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
                    // Update button size
                    if (this.plugin.scrollButton) {
                        this.plugin.scrollButton.style.width = `${value}px`;
                        this.plugin.scrollButton.style.height = `${value}px`;
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
                    // Update button color
                    if (this.plugin.scrollButton) {
                        this.plugin.scrollButton.style.backgroundColor = value;
                    }
                }));
    }
}

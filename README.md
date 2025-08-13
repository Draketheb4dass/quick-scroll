# Quick Scroll Plugin for Obsidian

A simple and efficient Obsidian plugin that adds a floating scroll button to quickly navigate to the bottom of your markdown documents.

## Features

- **Floating Scroll Button**: A customizable floating button that appears on your screen
- **Quick Navigation**: Instantly scroll to the bottom of any markdown document with one click
- **Customizable Appearance**: 
  - Choose button position (left, center, or right)
  - Adjust button size (20px to 50px)
  - Customize button color
- **Cross-Platform**: Works on Windows, macOS, and Linux
- **Smart Scrolling**: Automatically handles both editor and preview modes
- **Smooth Animations**: Hover effects and smooth transitions

## Installation

### From Obsidian Community Plugins (Recommended)
1. Open Obsidian Settings
2. Go to Community Plugins
3. Turn off Safe mode
4. Click Browse
5. Search for "Quick Scroll"
6. Click Install
7. Enable the plugin

### Manual Installation
1. Download the latest release from GitHub
2. Extract the files to your vault's `.obsidian/plugins/quick-scroll/` folder
3. Reload Obsidian
4. Enable the plugin in Settings → Community Plugins

## Usage

Once enabled, you'll see a floating blue button (↓) on your screen:

- **Click the button** to instantly scroll to the bottom of the current document
- **Works in both editor and preview modes**
- **Automatically appears when viewing markdown files**

## Configuration

Access the plugin settings in **Settings → Community Plugins → Quick Scroll**:

### Button Position
- **Left**: Position the button on the left side of the screen
- **Center**: Position the button in the center (default)
- **Right**: Position the button on the right side of the screen

### Button Size
- Adjust the button size from 20px to 50px
- Changes are applied immediately

### Button Color
- Choose any color for the button using the color picker
- Changes are applied immediately

## How It Works

The plugin creates a floating button that:
1. Detects when you're viewing a markdown document
2. Calculates the total number of lines in the document
3. Uses Obsidian's built-in scrolling API to navigate to the bottom
4. Handles both editor and preview modes intelligently
5. Provides smooth, instant scrolling

## Platform Compatibility

- ✅ **Windows**: Fully tested and compatible
- ✅ **macOS**: Fully tested and compatible  
- ✅ **Linux**: Compatible (uses standard web APIs)

## Troubleshooting

### Button Not Visible
- Make sure you have a markdown file open
- Check that the plugin is enabled in Community Plugins
- Try reloading Obsidian (Ctrl/Cmd + R)

### Scrolling Not Working
- Ensure you're viewing a markdown file (not a PDF, image, etc.)
- Check the console for any error messages
- Try switching between editor and preview modes

### Performance Issues
- The plugin is lightweight and shouldn't affect performance
- If you experience issues, try disabling other plugins to isolate the problem

## Development

### Building from Source
```bash
git clone https://github.com/your-username/quick-scroll.git
cd quick-scroll
npm install
npm run build
```

### Development Mode
```bash
npm run dev
```

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you find this plugin helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 💡 Suggesting new features
- 📝 Contributing to the codebase

## Changelog

### Version 0.1.0
- Initial release
- Basic scroll-to-bottom functionality
- Customizable button position, size, and color
- Support for editor and preview modes
- Cross-platform compatibility

---

**Made with ❤️ for the Obsidian community**

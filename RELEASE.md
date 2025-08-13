# Release Guide for Quick Scroll Plugin

## Pre-Release Checklist

### 1. Code Quality
- [x] All linter errors resolved
- [x] Plugin functionality tested
- [x] Settings working correctly
- [x] Cross-platform compatibility verified

### 2. Documentation
- [x] README.md updated with proper description
- [x] Installation instructions clear
- [x] Usage examples provided
- [x] Troubleshooting section added

### 3. Version Management
- [x] Version bumped to 1.0.0 in all files:
  - [x] `manifest.json`
  - [x] `package.json` 
  - [x] `versions.json`

### 4. Build Configuration
- [x] GitHub Actions workflow created (`.github/workflows/release.yml`)
- [x] esbuild config properly set up
- [x] `.gitignore` excludes build artifacts

## Release Process

### Step 1: Create and Push Git Tag
```bash
# Ensure all changes are committed
git add .
git commit -m "Prepare for v1.0.0 release"

# Create and push the tag
git tag v1.0.0
git push origin v1.0.0
```

### Step 2: GitHub Actions Automation
The workflow will automatically:
1. **Build** the plugin using `npm run build`
2. **Package** the release files (`manifest.json`, `main.js`, `styles.css`, `versions.json`)
3. **Create** a GitHub release with the tag
4. **Upload** the release files as attachments

### Step 3: Verify Release
- [ ] Check GitHub Actions workflow completed successfully
- [ ] Verify release files are attached to the GitHub release
- [ ] Test the release by downloading and installing manually

## Release Files Structure
```
Release v1.0.0 should contain:
├── manifest.json      (Plugin metadata)
├── main.js           (Compiled plugin code)
├── styles.css        (Plugin styles)
└── versions.json     (Version compatibility)
```

## Post-Release Tasks

### 1. Community Plugin Submission
- [ ] Submit pull request to [obsidian-releases](https://github.com/obsidianmd/obsidian-releases)
- [ ] Include plugin description, features, and screenshots
- [ ] Follow [plugin guidelines](https://docs.obsidian.md/Plugins/Releasing/Plugin+guidelines)

### 2. Documentation Updates
- [ ] Update any external documentation
- [ ] Create release notes on GitHub
- [ ] Update plugin description if needed

### 3. Monitoring
- [ ] Monitor for user feedback and issues
- [ ] Track download statistics
- [ ] Respond to community questions

## Troubleshooting Release Issues

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are properly installed
- Check for TypeScript compilation errors

### Release Creation Issues
- Ensure GitHub Actions has proper permissions
- Verify the tag format matches workflow expectations
- Check if the release already exists

### File Upload Issues
- Confirm all required files are present in the build
- Check file sizes and formats
- Verify GitHub Actions artifact upload succeeded

## Next Steps After Release

1. **Monitor Feedback**: Watch for user issues and feature requests
2. **Plan Updates**: Consider what improvements to make for v1.1.0
3. **Community Engagement**: Respond to questions and support requests
4. **Feature Development**: Work on enhancements based on user feedback

---

**Remember**: The first release is a milestone! Take time to celebrate and engage with the community.

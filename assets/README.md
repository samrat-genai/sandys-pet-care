# Assets Directory

This directory contains static assets for Sandy's Pet Care Solution website.

## Directory Structure

```
assets/
├── images/          # Product images, logos, icons
├── css/            # Stylesheets
├── js/             # JavaScript files
├── fonts/          # Custom fonts
└── icons/          # Icon files
```

## Image Guidelines

- **Product Images**: Use consistent dimensions (e.g., 400x400px)
- **Format**: Prefer WebP for better compression, with JPG/PNG fallbacks
- **Naming**: Use descriptive names like `dog-food-premium.webp`
- **Optimization**: Compress images for web use

## CSS Organization

- `styles.css`: Main stylesheet with global styles
- Use CSS custom properties (variables) for consistent theming
- Follow BEM methodology for class naming

## JavaScript Files

- `common.js`: Shared utilities and functions
- Keep files modular and well-documented
- Use ES6+ features where appropriate

## Font Usage

- Place custom fonts in the `fonts/` directory
- Include appropriate font-display declarations
- Provide fallback fonts for better performance

## Icon Guidelines

- Use SVG icons when possible for scalability
- Maintain consistent styling across all icons
- Consider using an icon system or sprite sheet
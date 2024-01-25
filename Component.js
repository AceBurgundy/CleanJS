/**
 * Represents a component with the ability to load scripts and attach CSS files.
 * @class
 */
export default class Component {
  constructor() {
    let scripts;
    let _template;

    const discouragedWindowAttached = [
      'It is not recommended to attach events to the window element.',
      'Add an id, and attach the event to the id instead.'
    ].join(' ')

    const warnScriptsAttachedToWindow = () => {
      const discouragedWindowEvents = [
        "window.on",
        "window.addeventlistener"
      ]

      const attachedToWindow = discouragedWindowEvents.some(eventType => {
        return scripts.toString().trim().toLowerCase().includes(eventType)
      })

      if (attachedToWindow) {
        console.warn(discouragedWindowAttached)
      }
    }

    /**
     * Load scripts based on the provided callback function.
     * @param {Function} scriptArgument - Callback function for loading scripts.
     */
    this.loadScripts = (scriptArgument) => {
      if (!scriptArgument) throw new Error("Missing callback argument for loadScripts");
      scripts = scriptArgument;
      warnScriptsAttachedToWindow();
    }

    /**
     * Load CSS files based on the provided paths.
     * @param {string[]} cssPaths - List of CSS paths to be loaded.
     */
    this.loadCSS = (cssPaths) => {
      cssPaths.forEach(cssPath => {
        const existingLink = document.querySelector(`link[href="${cssPath}"]`);
        
        if (existingLink) {
          console.warn(`CSS file already exists for path: ${cssPath}`);
          return;
        }
        
        const styleLink = document.createElement('link');
        styleLink.rel = 'stylesheet';
        styleLink.href = cssPath;
        document.head.appendChild(styleLink);
      });
    }

    /**
     * Render the template.
     * @param {string} template - The template to be rendered.
     */
    this.render = template => {
      if (!template || template.trim() === '') throw new Error('Template is missing');
      _template = template;

      if (scripts) setTimeout(scripts, 0);

      this.toString();
    }

    this.toString = () => _template;
  }
}
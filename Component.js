/**
 * Represents a component with the ability to load scripts and attach CSS files.
 * @class
 */
export default class Component {
  constructor() {
    let scripts;
    let _template;
    let cssPromises = [];

    const shouldNotAttachToWindow = [
      'It is not recommended to attach events to the window element.',
      'Add an id, and attach the event to the id instead.'
    ].join(' ')

    /**
     * Warns if any events are attached to the window
     *
     * This is because the Component removes the event just as how javascript
     * removes events after an element has been removed. Thats why removing an element where the script
     * is attached to the window would cause unexpected behaviour if the same listener has been reattached again.
     */
    const warnScriptsAttachedToWindow = () => {
      const discouragedWindowEvents = [
        'window.on',
        'window.addeventlistener'
      ]

      const attachedToWindow = discouragedWindowEvents.some(eventType => {
        return scripts.toString().trim().toLowerCase().includes(eventType)
      })

      if (attachedToWindow) {
        console.warn(shouldNotAttachToWindow)
      }
    }

    /**
     * Returns the full path of a script from the html file
     * @param {'import.meta'} importMeta - Exposes context-specific metadata to a module.
     * It contains information about the module, such as the module's URL. Simply pass ```import.meta``` as an argument
     * @returns {string} the import.meta script src or an empty string
     */
    this.getFullPath = importMeta => {
      const scriptSrc = new URL(importMeta.url).pathname;
      return scriptSrc.startsWith('/') ? scriptSrc.slice(1) : scriptSrc;
    }

    /**
     * Load scripts based on the provided callback function.
     * @param {Function} scriptArgument - Callback function for loading scripts.
     */
    this.scripts = (scriptArgument) => {
      if (!scriptArgument) throw new Error('Missing callback argument for loadScripts');
      scripts = scriptArgument;
      warnScriptsAttachedToWindow();
    }

    /**
     * Load CSS files based on the provided paths.
     * @param {string[]} cssPaths - List of CSS paths to be loaded.
     */
    this.css = (importMeta, cssPaths) => {
      cssPaths.forEach(cssPath => {
        let pathToScript = this.getFullPath(importMeta);

        const scriptFileName = pathToScript.split('/').pop();
        pathToScript = pathToScript.replace(scriptFileName, '');

        if (cssPath.startsWith('/')) {
          cssPath = pathToScript + cssPath;
        }

        else if (!cssPath.includes('/')) {
          cssPath = pathToScript + '/' + cssPath;
        }

        else if (cssPath.startsWith('./')) {
          cssPath = cssPath.slice(2);
          cssPath = pathToScript + cssPath;
        }

        const cssAlreadyLinked = document.querySelector(`link[href='${cssPath}']`);

        if (cssAlreadyLinked) {
          return;
        }

        const cssPromise = new Promise((resolve, reject) => {
          const styleLink = document.createElement('link');
          styleLink.rel = 'stylesheet';
          styleLink.href = cssPath;
          styleLink.onload = () => resolve();
          styleLink.onerror = () => reject();
          document.head.appendChild(styleLink);
        });

        cssPromises.push(cssPromise);
      });
    }

    this.template = template => {
      if (!template) {
        throw new Error('Template is required for a component');
      }

      if (typeof template !== 'string') {
        throw new Error('Template must be a string');
      }

      if (template === '') {
        throw new Error('Template is required for a component');
      }

      _template = template;
    }

    /**
     * Render the template.
     * @param {string} template - The template to be rendered.
     */
    this.render = element => {
      Promise.all(cssPromises)
          .then(() => {
            console.log('called');
            element.innerHTML = _template;
            scripts();
          })
          .catch(error =>
              console.error('Failed to load css: ', error)
            )
    }
  }
}
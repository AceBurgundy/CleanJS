/**
 * Returns the full path from the template file to where a function was called;
 * @param {'import.meta'} importMeta - the import.meta of a function. Simply pass `import.meta`
 * @throws {Error} if importMeta is null
 * @return {string} the full path
 */
export const getFullPath = (importMeta) => {
  if (!importMeta) {
    throw new Error('Missing import.meta. Simply pass `import.meta` as the argument');
  }

  const scriptSrc = new URL(importMeta.url).pathname;
  return scriptSrc.startsWith("/") ? scriptSrc.slice(1) : scriptSrc;
};

export default class Component {
  constructor() {
    const _cssPromises = [];
    let _template;
    let _scripts;

    const shouldNotAttachToWindow = [
      'It is not recommended to attach events to the window element.',
      'Add an id, and attach the event to the id instead.'
    ].join(' ');

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
        return _scripts.toString().trim().toLowerCase().includes(eventType)
      })

      if (attachedToWindow) {
        console.warn(shouldNotAttachToWindow)
      }
    }

    /**
     * Load CSS files based on the provided paths.
     * @param {'import.meta'} importMeta - the import.meta of a function. Simply pass `import.meta`
     * @throws {Error} if importMeta is null
     * @param {string[]} cssPaths - list of CSS paths to be loaded.
     */
    this.css = (importMeta, cssPaths) => {
      let scriptPath = getFullPath(importMeta);

      const scriptFileName = scriptPath.split("/").pop();
      scriptPath = scriptPath.replace(scriptFileName, "");

      if (!cssPaths) {
        console.error(`List of css paths is empty from ${scriptFileName}`);
        return;
      }

      cssPaths.forEach((cssPath) => {
        if (cssPath.startsWith("/")) {
          cssPath = scriptPath + cssPath;
        }

        else if (!cssPath.includes("/")) {
          cssPath = scriptPath + "/" + cssPath;
        }

        else if (cssPath.startsWith("./")) {
          cssPath = cssPath.slice(2);
          cssPath = scriptPath + cssPath;
        }

        const cssAlreadyLinked = document.querySelector(
          `link[href='${cssPath}']`
        );

        if (cssAlreadyLinked) {
          return;
        }

        const cssPromise = new Promise((resolve, reject) => {
          const styleLink = document.createElement("link");
          styleLink.rel = "stylesheet";
          styleLink.href = cssPath;
          styleLink.onload = () => resolve();
          styleLink.onerror = () => reject();
          document.head.appendChild(styleLink);
        });

        _cssPromises.push(cssPromise);
      });
    }

    /**
     * Sets the script for the template code
     *
     * @throws {Error} if script argument is null
     * @throws {Error} if script argument is not a function
     */
    this.scripts = script => {
      if (!script) {
        throw new Error('Setting scripts with a missing argument')
      };

      if (typeof script !== 'function') {
        throw new Error('Script argument must be a function or a callback function')
      };

      _scripts = script;
      warnScriptsAttachedToWindow();
    }

    /**
     * Sets the template for the template
     *
     * @throws {Error} if template is null
     * @throws {Error} if template is not a string
     * @throws {Error} if template is an empty string
     */
    this.template = html => {
      if (!html) {
        throw new Error('Template is required for a component');
      }

      if (typeof html !== 'string') {
        throw new Error('Template must be a string');
      }

      if (html === '') {
        throw new Error('Template is required for a component');
      }

      _template = html;
    }

    /**
     * Render the template.
     * @param {string} template - The template to be rendered.
     * @throws {Error} if element to render to is null
     */
    this.render = element => {
      if (!element) {
        throw new Error('Element is required to render the template to');
      }

      Promise.all(_cssPromises)
        .then(() => {
          element.innerHTML = _template;
          if (_scripts) _scripts();
        })
        .catch(error =>
          console.error('Failed to load css: ', error)
        )
    }
  }
}

/**
 * Returns the full path from the template file to where a function was called;
 * @param {'import.meta'} importMeta - the import.meta of a function. Simply pass `import.meta`
 * @throws {Error} if importMeta is null
 * @return {string} the full path
 */
export const getFullPath = (importMeta) => {
  if (!importMeta) {
    throw new Error(
      "Missing import.meta. Simply pass `import.meta` as the argument"
    );
  }

  const scriptSrc = new URL(importMeta.url).pathname;
  return scriptSrc.startsWith("/") ? scriptSrc.slice(1) : scriptSrc;
};

export const uniqueId = () => Math.random().toString(36).substring(2, 10);

/**
 * Load CSS files based on the provided paths.
 * @param {string[]} cssPaths - List of CSS paths to be loaded.
 **/
export const css = (importMeta, cssPaths) =>
  cssPaths.forEach((cssPath) => {
    let pathToScript = getFullPath(importMeta);
    const scriptFileName = pathToScript.split("/").pop();
    pathToScript = pathToScript.replace(scriptFileName, "");

    if (cssPath.startsWith("/")) {
      cssPath = pathToScript + cssPath;
    } else if (!cssPath.includes("/")) {
      cssPath = pathToScript + "/" + cssPath;
    } else if (cssPath.startsWith("./")) {
      cssPath = cssPath.slice(2);
      cssPath = pathToScript + cssPath;
    }

    const cssAlreadyLinked = document.querySelector(`link[href='${cssPath}']`);

    if (cssAlreadyLinked) {
      console.warn(`CSS file already exists for path: ${cssPath}`);
      return;
    }

    const styleLink = document.createElement("link");
    styleLink.rel = "stylesheet";
    styleLink.href = cssPath;

    document.head.appendChild(styleLink);
  });

export default class Component {
  constructor() {
    this.template = "";
    this.scripts = null;
    this.states = {};
    this._stateElements  = {};

    /**
     * Helper function to validate the template and scripts.
     */
    const validate = () => {
      if (typeof this.template !== "string") {
        throw new Error("Template must be a string");
      }

      if (!this.template) {
        throw new Error("Template is required for a component");
      }

      if (this.scripts && typeof this.scripts !== "function") {
        throw new Error("Scripts must be a function");
      }
    };

    /**
     * Function to manage state and return a state value with a setter.
     * @param {any} initialValue - Initial state value.
     * @param {string} uniqueElementId - The uniqueElementId for the element tied to this state.
     * @returns {[any, function]} Current state and a setter function to update the state.
     */
    this.state = (initialValue, uniqueElementId) => {
      let value = initialValue;

      // Setter function to update the value and DOM
      const setValue = newValue => {

        value = newValue;

        /**
         * @type {HTMLElement}
         */
        const element = this._stateElements[uniqueElementId];

        if (!element) {
          return;
        }

        element.textContent = value;
      };

      // Save the initial value and element uniqueElementId
      this.states[uniqueElementId] = value;

      // To be used later to track elements associated with the state
      return [value, setValue];
    };

    /**
     * Called after rendering to bind elements to states.
     */
    const bindStateElements = () => {
      Object.keys(this.states).forEach(uniqueElementId => {
        this._stateElements[uniqueElementId] = document.getElementById(uniqueElementId);

        if (!this._stateElements[uniqueElementId]) {
          console.warn(`No element found with unique element id: ${uniqueElementId}`);
        }
      });
    };

    /**
     * Render the template and bind event listeners.
     */
    this.render = () => {
      validate();

      // Append the root element to the DOM
      setTimeout(() => {
        bindStateElements(); // Bind state elements after rendering
        if (this.scripts) this.scripts(); // Execute scripts (event listeners etc.)
      }, 0);

      return this.template; // Return the rendered template
    };
  }

  toString = () => this.render();
}

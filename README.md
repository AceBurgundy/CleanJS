## Lite-SPA-JS: A Simple SPA Framework for Small Projects (Built For Fun)

**Lite-SPA-JS** is a lightweight JavaScript library designed to simplify creating single-page applications (SPAs) for small projects. It avoids complex boilerplate code, making it easy to get started with basic navigation and component management.

### Features

* **Simple Routing:** Navigate between different parts of your application using anchor tags and the `Redirect` component.
* **Component Based:** Define reusable components with templates and optional scripts for event handling.
* **State Management:** Manage state within components and update the DOM automatically.

### Getting Started

1. **Installation:**  
   Download the Lite-SPA-JS library and include it in your project or install it using a package manager (not yet available for package managers).

2. **Create Components:**  
   Define your application's components by extending the `Component` class. Each component should have a template string and optionally, script logic for event handling.  

3. **Define Routes:**  
   Use the `Redirect` component within your main component's template to define navigation links for each page/component.

4. **Render the Application:**  
   Import your main component and use the `Root` component to render it as the initial view.

### Example Usage

**Component Example (Home.js):**

```javascript
import Component from "./Component.js";

export default class Home extends Component {
  constructor() {
    super();

    this.template = /* html */`
      <h1>Welcome to the Home Page!</h1>
      <p>This is the content of the Home page.</p>
    `;
  }
}
```

**Router Example (Router.js):**

```javascript
import Component, { Redirect } from "./Component.js";
import About from "./Pages/About/About.js";
import Home from "./Pages/Home/Home.js";

export default class Router extends Component {
  constructor() {
    super();
    this.template = /* html */`
      <nav id="navigation">
        ${new Redirect({
          destination: About,
          id: "about-page",
          path: "/about",
          attributes: { "class": "nav-item button-primary" },
          innerHTML: "About",
        })}
      </nav>
      ${new Home()}
    `;
  }
}
```

**Main Script (script.js):**

```javascript
import { Root } from './Component.js';
import Router from "./Router.js"

new Root({destination: Router}).render();
```

**index.html:**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <title>My Lite-SPA App</title>
    <script src="script.js" type="module"></script>
    <link rel="stylesheet" href="style.css" type="text/css" media="all" />
  </head>
  <body>
  </body>
</html>
```

This is a basic example. Refer to the comments within the code for more details on each component.

### Benefits

* **Lightweight:**  Lite-SPA-JS keeps the codebase small and avoids unnecessary complexity for simple projects.
* **Easy to Learn:**  The framework uses simple concepts and requires minimal setup, making it ideal for beginners.
* **Flexibility:**  You can still leverage your existing JavaScript knowledge to build components and handle logic.

### Limitations

* **Limited Features:**  Lite-SPA-JS is designed for basic functionality and lacks advanced features found in larger SPA frameworks.
* **No Routing API:**  Routes are defined within component templates, offering less control compared to dedicated routing libraries.
* **No Dependency Injection:**  Managing dependencies requires manual techniques.

**Overall, Lite-SPA-JS is a great choice for creating small, focused SPAs where simplicity and ease of use are the primary goals.**

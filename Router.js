import About from "./Pages/About/About.js"
import Home from "./Pages/Home/Home.js"
import Component, { Redirect } from "./Component.js"

export default class Router extends Component {
  constructor() {
    super();

    this.template = /* html */`
      <nav id="navigation">
        ${
          new Redirect({
            destination: About,
            id: "about-page",
            path: "/about",
            attributes: {"class": "nav-item button-primary"},
            innerHTML: "About"
          })
        }
      </nav>
      ${new Home()}
  `;
  }
}

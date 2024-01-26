import About from "./Pages/About/About.js"
import Home from "./Pages/Home/Home.js"
import Component from "./Component.js"

export default class Router extends Component {
  constructor() {
    super();

    const managerId = 'manager'

    const pages = {
      Home,
      About
    }

    const toggleCover = () => {
      cover.classList.toggle('active')
    }

    const transition = page => {
      const manager = document.getElementById(managerId);
      manager.innerHTML = new pages[page]()
    };

    this.loadScripts(() => {
      const navItems = document.querySelectorAll('.nav-item');

      [...navItems].forEach(item => {
        item.onclick = () => {
          transition(item.textContent);
        }
      })

      transition('Home')
    });

    this.render(/* html */`
      <nav id="navigation">
        ${
          Object.keys(pages).map(page => {
            return `<button class='nav-item button-primary'>${page}</button>`;
          }).join('')
        }
      </nav>
      <section id="cover"></section>
      <section id="${managerId}" style="height: 100%;"></section>
    `);
  }
}
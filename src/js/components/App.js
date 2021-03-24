import Stations from './Stations';
import Lines from './Lines';
import Sections from './Sections';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Router from '../router/Router';
import {
  ELEMENT,
  MENU_TITLE,
  PATH,
  SESSION_KEY_TOKEN,
  SUCCESS_MESSAGE,
  SNACKBAR_SHOW_TIME,
  SIGN_OUT_CONFIRM_MESSAGE,
} from '../utils/constants';
import { $, $$ } from '../utils/dom';
import { showSnackbar } from '../utils/snackbar';
import { isRouterButton } from '../validators/validation';

class App {
  constructor() {
    this.selectDom();
    this.bindEvent();
    this.router = new Router(this.$mainScreen);
  }

  init() {
    this.stations = new Stations();
    this.lines = new Lines();
    this.sections = new Sections();
    this.signIn = new SignIn({
      initializeRoutedPage: this.initializeRoutedPage.bind(this),
      changeSignInToSignOutStatus: this.changeSignInToSignOutStatus.bind(this),
    });
    this.signUp = new SignUp({ initializeRoutedPage: this.initializeRoutedPage.bind(this) });
  }

  selectDom() {
    this.$app = $(`.${ELEMENT.APP}`);
    this.$mainScreen = $(`.${ELEMENT.MAIN_SCREEN}`);
    this.$signInButton = $(`.${ELEMENT.NAV_BAR_SIGN_IN_BUTTON}`);
    this.$$mainMenuButtons = $$(`.${ELEMENT.NAV_BAR} .${ELEMENT.MAIN_MENU_ROUTER}`);
  }

  bindEvent() {
    window.addEventListener('popstate', (e) => {
      this.router.render(e.state.path);
    });

    this.$app.addEventListener('click', (e) => {
      if (!isRouterButton(e.target)) return;
      e.preventDefault();

      this.handleSelectMenu(e);
    });
  }

  handleSelectMenu(e) {
    const path = e.target.closest('a').getAttribute('href');

    if (path === PATH.SIGNOUT) {
      this.runSignOutProcess();

      return;
    }

    this.initializeRoutedPage(path);
  }

  async initializeRoutedPage(path) {
    await this.router.route(path);
    this.runPathMatchedAction(path);
  }

  runPathMatchedAction(path) {
    const pathActions = {
      [PATH.SIGNIN]: () => {
        this.signIn.init();
      },
      [PATH.SIGNUP]: () => {
        this.signUp.init();
      },
    };

    pathActions[path]?.();
  }

  runSignOutProcess() {
    if (!window.confirm(SIGN_OUT_CONFIRM_MESSAGE)) {
      return;
    }

    this.changeSignOutToSignInStatus();
    this.router.route(PATH.MAIN);
    showSnackbar({ message: SUCCESS_MESSAGE.SIGN_OUT, showtime: SNACKBAR_SHOW_TIME });
  }

  changeSignInToSignOutStatus(accessToken) {
    sessionStorage.setItem(SESSION_KEY_TOKEN, accessToken);
    this.$signInButton.innerText = MENU_TITLE.SIGN_OUT;
    this.$signInButton.closest('a').href = PATH.SIGNOUT;
    this.showMenuButton();
  }

  changeSignOutToSignInStatus() {
    sessionStorage.removeItem(SESSION_KEY_TOKEN);
    this.$signInButton.innerText = MENU_TITLE.SIGN_IN;
    this.$signInButton.closest('a').href = PATH.SIGNIN;
    this.hideMenuButton();
  }

  showMenuButton() {
    this.$$mainMenuButtons.forEach((button) => {
      button.classList.remove('d-none');
    });
  }

  hideMenuButton() {
    this.$$mainMenuButtons.forEach((button) => {
      !button.classList.contains(`${ELEMENT.NAV_BAR_SIGN_IN_BUTTON}`) && button.classList.add('d-none');
    });
  }
}

export default App;

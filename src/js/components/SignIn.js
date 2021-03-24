import { requestGetToken } from '../requestData/requestUserData';
import { showSnackbar } from '../utils/snackbar';
import { SIGN_IN, ELEMENT, SNACKBAR_SHOW_TIME, SUCCESS_MESSAGE } from '../utils/constants';
import { $ } from '../utils/dom';

class SignIn {
  constructor(props) {
    this.props = props;
  }

  init() {
    this.selectDom();
    this.bindEvent();
  }

  selectDom() {
    this.$signInForm = $(`.${ELEMENT.SIGN_IN_FORM}`);
  }

  bindEvent() {
    this.$signInForm.addEventListener('submit', (e) => {
      e.preventDefault();

      this.handleSignIn(e.target);
    });
  }

  handleSignIn(target) {
    const email = target[ELEMENT.EMAIL].value;
    const password = target[ELEMENT.PASSWORD].value;

    this.requestSignIn({ email, password });
  }

  async requestSignIn({ email, password }) {
    try {
      const accessToken = await requestGetToken({ email, password });
      this.manageSignInSuccess(accessToken);
    } catch (error) {
      this.manageSignInFail(error.message);
    }
  }

  manageSignInSuccess(accessToken) {
    this.props.changeFromSignOutToSignInStatus(accessToken);
    showSnackbar({ message: SUCCESS_MESSAGE.SIGN_IN, showtime: SNACKBAR_SHOW_TIME });
  }

  manageSignInFail(statusCode) {
    this.getMatchedAlert(statusCode);
  }

  getMatchedAlert(statusCode) {
    const errorMessage = SIGN_IN.ERROR_ALERT_MATCH[statusCode];

    if (!errorMessage) {
      alert(SIGN_IN.FAIL_MESSAGE);
      return;
    }

    alert(errorMessage);
  }
}

export default SignIn;

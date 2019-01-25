import I18n from "i18n-js";
import * as React from "react";
import RNLanguages from "react-native-languages";
import { Provider, connect } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import AppScreen from "./AppScreen";

import Tracking from "./tracking/TrackingManager";

import connectionTracker from "./infra/reducers/connectionTracker";
import ui from "./infra/reducers/ui";
import timeline from "./timeline/reducer";

import { login, refreshToken } from "./user/actions/login";

import moduleDefinitions from "./AppModules";
import { getReducersFromModuleDefinitions } from "./infra/moduleTool";

import { AppState, AsyncStorage } from "react-native";
import firebase from "react-native-firebase";
import {
  Notification,
  NotificationOpen
} from "react-native-firebase/notifications";

import { loadCurrentPlatform, unSelectPlatform } from "./user/actions/platform";
import { isInActivatingMode } from "./user/selectors";

// Disable Yellow Box on release builds.
if (!__DEV__) {
  // tslint:disable-next-line:no-console
  console.disableYellowBox = true;
}

const reducers = {
  connectionTracker,
  ui,
  ...getReducersFromModuleDefinitions(moduleDefinitions)
};

const rootReducer = combineReducers({
  ...reducers,
  timeline // TODO put this in module definitions
});

const enhancer = applyMiddleware(thunkMiddleware);
const store = createStore(rootReducer, enhancer);

// Translation setup
I18n.fallbacks = true;
I18n.defaultLocale = "en";
I18n.translations = {
  en: require("../assets/i18n/en"),
  es: require("../assets/i18n/es"),
  fr: require("../assets/i18n/fr")
};
// Print current device language
// console.log("language", RNLanguages.language);
// Print user preferred languages (in order)
// console.log("languages", RNLanguages.languages);
I18n.locale = RNLanguages.language;

class AppStoreUnconnected extends React.Component<
  { currentPlatformId: string; store: any },
  {}
  > {
  private notificationOpenedListener;
  private onTokenRefreshListener;

  public state = {
    appState: null
  };

  public render() {
    return (
      <Provider store={this.props.store}>
        <AppScreen />
      </Provider>
    );
  }

  public async componentWillMount() {
    await Tracking.init();
    RNLanguages.addEventListener("change", this.onLanguagesChange);
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  public async componentDidMount() {
    if (this.props.currentPlatformId) {
      //IF WE ARE NOT IN ACTIVATION MODE => TRY TO LOGIN => ELSE STAY ON ACTIVATION PAGE
      if (!isInActivatingMode(this.props.store.getState())) {
        // Auto Login if possible
        this.props.store.dispatch(login(true));
      }
      //TODO unsubscribe on unmount=>leak
      this.notificationOpenedListener = firebase
        .notifications()
        .onNotificationOpened((notificationOpen: NotificationOpen) =>
          this.handleNotification(notificationOpen)
        );
      this.onTokenRefreshListener = firebase
        .messaging()
        .onTokenRefresh(fcmToken => {
          this.handleFCMTokenModified(fcmToken);
        });

      const notificationOpen: NotificationOpen = await firebase
        .notifications()
        .getInitialNotification();
      if (notificationOpen) {
        this.handleNotification(notificationOpen);
      }
    } else {
      // Load platform
      this.props.store.dispatch(loadCurrentPlatform());
    }
  }

  public async componentDidUpdate() {
    this.componentDidMount();
  }

  public componentWillUnmount() {
    RNLanguages.removeEventListener("change", this.onLanguagesChange);
    AppState.removeEventListener("change", this.handleAppStateChange);
    this.notificationOpenedListener();
    this.onTokenRefreshListener();
  }

  private onLanguagesChange = ({ language }) => {
    I18n.locale = language;
  };

  private handleAppStateChange = (nextAppState: string) => {
    this.setState({ appState: nextAppState });
    // if (nextAppState === "active") {
    //   console.log("app is now active again !");
    // }
  };

  private handleNotification = (notificationOpen: NotificationOpen) => {
    // Get the action triggered by the notification being opened
    const action = notificationOpen.action;
    // Get information about the notification that was opened
    const notification: Notification = notificationOpen.notification;
    // console.log("got notification !!", notification);
    Tracking.logEvent("openNotificationPush");
    this.props.store.dispatch({
      notification,
      type: "NOTIFICATION_OPEN"
    });
  };

  private handleFCMTokenModified = fcmToken => {
    this.props.store.dispatch(refreshToken(fcmToken));
  };
}

function connectWithStore(store, WrappedComponent, ...args) {
  const ConnectedWrappedComponent = connect(...args)(WrappedComponent);
  return props => {
    return <ConnectedWrappedComponent {...props} store={store} />;
  };
}

const mapStateToProps = (state: any, props: any) => ({
  currentPlatformId: state.user.auth.platformId,
  store
});

export const AppStore = connectWithStore(
  store,
  AppStoreUnconnected,
  mapStateToProps
);

export default AppStore;

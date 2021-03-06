import * as React from "react";
import { createStackNavigator } from "react-navigation";
import { navScreenOptions } from "../../navigation/helpers/navHelper";
import { AppTitle, Header } from "../headers/Header";
import { UiShowCase } from "./UiShowcase";

export default createStackNavigator({
  UiShowcase: {
    screen: UiShowCase,
    navigationOptions: ({ navigation }) =>
      navScreenOptions(
        {
          header: <UiHeader navigation={navigation} />
        },
        navigation
      )
  }
});

export class UiHeader extends React.Component<{ navigation?: any }, undefined> {
  render() {
    return (
      <Header>
        <AppTitle>UI Showcase</AppTitle>
      </Header>
    );
  }
}

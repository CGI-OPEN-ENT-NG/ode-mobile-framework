import * as React from "react";
import { createStackNavigator } from "react-navigation";
import { navScreenOptions } from "../navigation/helpers/navHelper";
import ThreadListPage from "./containers/ThreadListPage";
import ThreadListPageHeader from "./containers/ThreadListPageHeader";

export default createStackNavigator({
  listThreads: {
    navigationOptions: ({ navigation }) =>
      navScreenOptions(
        {
          header: (
            <ThreadListPageHeader
              navigation={navigation} // TS-ISSUE
              date={navigation.getParam("homework-date", null)}
            />
          )
        },
        navigation
      ),
    screen: ThreadListPage
  }
});

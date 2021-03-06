// Libraries
import style from "glamorous-native";
import I18n from "i18n-js";
import * as React from "react";
import { Image, SafeAreaView, ScrollView, View } from "react-native";
import { connect } from "react-redux";

// Components
import TouchableOpacity from "../../ui/CustomTouchableOpacity";
import { H1, Light, LightP } from "../../ui/Typography";

// Type definitions
import Conf from "../../Conf";
import { CommonStyles } from "../../styles/common/styles";
import { selectPlatform } from "../actions/platform";
import { IUserAuthState } from "../reducers/auth";

// Props definition -------------------------------------------------------------------------------

export interface IPlatformSelectPageDataProps {
  auth: IUserAuthState;
  headerHeight: number;
}

export interface IPlatformSelectPageEventProps {
  onPlatformSelected: (platformId: string) => Promise<void>;
}

export interface IPlatformSelectPageOtherProps {
  navigation?: any;
}

export type IPlatformSelectPageProps = IPlatformSelectPageDataProps &
  IPlatformSelectPageEventProps &
  IPlatformSelectPageOtherProps;

// State definition -------------------------------------------------------------------------------

// No state

// Main component ---------------------------------------------------------------------------------

const PlatformButton = style(TouchableOpacity)({
  elevation: 3,
  shadowColor: "#6B7C93",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 2,

  flexDirection: "column",
  paddingHorizontal: 16,
  paddingVertical: 32,

  backgroundColor: "#FFFFFF"
});

export class PlatformSelectPage extends React.PureComponent<
  IPlatformSelectPageProps,
  {}
> {
  public render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <ScrollView alwaysBounceVertical={false}>
          <H1
            style={{
              color: CommonStyles.textColor,
              fontSize: 20,
              fontWeight: "normal",
              marginTop: 55,
              textAlign: "center"
            }}
          >
            {I18n.t("welcome")}
          </H1>
          <LightP style={{ textAlign: "center", marginBottom: 12 }}>
            {I18n.t("select-platform")}
          </LightP>
          <View style={{ flexDirection: "row", flexWrap: "wrap", padding: 12 }}>
            {Object.entries(Conf.platforms).map(
              ([platformId, platformConf]) => (
                <View
                  key={platformId}
                  style={{
                    flexBasis: "50%",
                    padding: 12
                  }}
                >
                  <PlatformButton
                    onPress={e => this.handleSelectPlatform(platformId)}
                    style={{
                      alignItems: "center"
                    }}
                  >
                    <Image
                      resizeMode="contain"
                      style={{ height: 40, width: "100%", marginBottom: 20 }}
                      source={platformConf.logo}
                    />
                    <Light>{platformConf.displayName}</Light>
                  </PlatformButton>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Event handlers

  protected handleSelectPlatform(platformId: string) {
    this.props.onPlatformSelected(platformId);
  }
}

export default connect(
  (state: any, props: any) => ({}),
  dispatch => ({
    onPlatformSelected: (platformId: string) => {
      dispatch<any>(selectPlatform(platformId, true));
    }
  })
)(PlatformSelectPage);

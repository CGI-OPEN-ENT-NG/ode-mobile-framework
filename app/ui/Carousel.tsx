import style from "glamorous-native";
import I18n from "i18n-js";
import * as React from "react";
import {
  Dimensions,
  ImageURISource,
  Linking,
  Modal,
  Platform,
  Text,
  View
} from "react-native";
import FastImage from "react-native-fast-image";
import RNCarousel from "react-native-snap-carousel";

import { Icon } from ".";
import { CommonStyles } from "../styles/common/styles";
import TouchableOpacity from "./CustomTouchableOpacity";
import ImageOptional from "./ImageOptional";
import { A, Italic } from "./Typography";

const Close = style(TouchableOpacity)({
  height: 40,
  width: 40,
  borderRadius: 20,
  alignItems: "center",
  justifyContent: "center",
  position: "absolute",
  top: Platform.OS === "ios" ? 20 : 0,
  right: 0
});

const UnavailableImage = () => (
  <View
    style={{
      alignItems: "center",
      height: "100%",
      justifyContent: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      width: "100%"
    }}
  >
    <Italic>{I18n.t("imageNotAvailable")}</Italic>
  </View>
);

export class Carousel extends React.Component<
  {
    images: Array<{ src: ImageURISource; alt: string; linkTo?: string }>;
    visible: boolean;
    startIndex?: number;
    onClose: () => void;
  },
  undefined
> {
  public carouselRef: any;
  public currentScroll = 0;
  public previousScroll = 0;
  public currentImage: number = 0;

  public scrollToCurrentImage() {
    // console.log("scroll to current", this.currentImage);
    this.carouselRef.scrollToIndex({
      index: this.currentImage,
      viewOffset: 0,
      viewPosition: 0.5
    });
  }

  public slideToImage(e: number) {
    // console.log("scroll to", e);
    this.carouselRef.scrollToIndex({
      index: e,
      viewOffset: 0,
      viewPosition: 0.5
    });
  }

  public render() {
    return (
      <Modal
        visible={this.props.visible}
        onRequestClose={() => this.setState({ fullscreen: false })}
        transparent={true}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.90)" }}>
          <RNCarousel
            data={this.props.images}
            renderItem={({
              item,
              index
            }: {
              item: { src: ImageURISource; alt: string; linkTo?: string };
              index: number;
            }) => (
              <View
                key={index}
                style={{
                  height: "100%",
                  width: Dimensions.get("window").width
                }}
              >
                <ImageOptional
                  imageComponent={FastImage}
                  errorComponent={<UnavailableImage />}
                  style={{
                    height: "100%",
                    width: Dimensions.get("window").width
                  }}
                  resizeMode={FastImage.resizeMode.contain}
                  source={item.src}
                />
                {item.linkTo ? (
                  <View
                    style={{
                      bottom: 15,
                      padding: 20,
                      position: "absolute",
                      width: "100%"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => Linking.openURL(item.linkTo)}
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        padding: 10,
                        width: "100%"
                      }}
                    >
                      <Text
                        style={{
                          color: CommonStyles.lightGrey,
                          textAlign: "center",
                          width: "100%"
                        }}
                      >
                        {I18n.t("linkTo")}{" "}
                        <A>
                          {(() => {
                            const matches = item.linkTo.match(
                              // from https://stackoverflow.com/a/8498629/6111343
                              /^https?\:\/\/([^\/:?#]+)(?:[\/:?#]|$)/i
                            );
                            return matches && matches[1];
                          })()}
                        </A>
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
            itemWidth={Dimensions.get("window").width}
            sliderWidth={Dimensions.get("window").width}
            firstItem={this.props.startIndex || 0}
            ref={r => (this.carouselRef = r)}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => index.toString()}
            decelerationRate="fast"
          />
          <Close onPress={() => this.props.onClose()}>
            <Icon size={16} color="#ffffff" name="close" />
          </Close>
        </View>
      </Modal>
    );
  }
}

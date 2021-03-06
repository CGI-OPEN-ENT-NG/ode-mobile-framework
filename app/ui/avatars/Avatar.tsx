import style from "glamorous-native";
import * as React from "react";
import { ImageProps } from "react-native";
import Conf from "../../Conf";
import { Connection } from "../../infra/Connection";

export enum Size {
  aligned,
  large,
  small,
  verylarge
}
const StyledImage = {
  borderColor: "white",
  borderWidth: 1
};

const LargeImage = style.image({
  ...StyledImage,
  borderRadius: 24,
  height: 45,
  width: 45
});

const MediumImage = style.image({
  ...StyledImage,
  borderRadius: 16,
  height: 35,
  width: 35
});

const AlignedContainer = style.view(
  {
    borderRadius: 16,
    height: 29,
    marginRight: -4,
    marginLeft: -4,
    width: 29,
    backgroundColor: "#EEEEEE"
  },
  ({ index }) => ({
    zIndex: 100 - index
  })
);

const VLContainer = style.view({
  alignSelf: "center",
  borderRadius: 35,
  height: 71,
  width: 71,
  margin: 0,
  backgroundColor: "#EEEEEE"
});

const LargeContainer = style.view({
  borderRadius: 24,
  height: 45,
  width: 45,
  backgroundColor: "#EEEEEE"
});

const MediumContainer = style.view({
  borderRadius: 16,
  height: 35,
  width: 35,
  backgroundColor: "#EEEEEE"
});

const AlignedImage = style.image({
  ...StyledImage,
  borderRadius: 16,
  height: 29,
  width: 29
});

const VeryLargeImage = style.image(
  {
    ...StyledImage,
    alignSelf: "center",
    borderRadius: 35,
    height: 71,
    width: 71,
    margin: 0
  },
  ({ decorate }) => ({
    borderWidth: decorate ? 1 : 0
  })
);

const SmallImage = style.image(
  {
    borderColor: "white",
    borderWidth: 1
  },
  ({ count }) => ({
    borderRadius: count === 1 ? 22 : count === 2 ? 15 : 10,
    height: count === 1 ? 45 : count === 2 ? 31 : 22,
    width: count === 1 ? 45 : count === 2 ? 31 : 22
  })
);

const SmallContainer = style.view(
  {
    position: "absolute",
    backgroundColor: "#EEEEEE"
  },
  ({ count, index }) => ({
    borderRadius: count === 1 ? 22 : count === 2 ? 15 : 10,
    height: count === 1 ? 45 : count === 2 ? 31 : 22,
    left:
      count === 2
        ? index === 0
          ? 0
          : 15
        : index === 0 || (index === 2 && count === 4)
          ? 0
          : index === 2
            ? 14
            : 25,
    top: count === 2 ? (index === 0 ? 0 : 15) : index < 2 ? 0 : 25,
    width: count === 1 ? 45 : count === 2 ? 31 : 22
  })
);

export interface IAvatarProps {
  count?: number;
  decorate?: boolean;
  id: string;
  index?: number;
  large?: boolean;
  size: Size;
  width?: number;
}

export class Avatar extends React.Component<
  IAvatarProps,
  { status: "initial" | "loading" | "success" | "failed" }
  > {
  decorate: boolean;
  count: number;

  constructor(props) {
    super(props);

    this.decorate = true;
    if (this.props.decorate !== undefined) {
      this.decorate = this.props.decorate;
    }

    this.state = { status: "initial" };
  }

  public componentDidMount() {
  }

  public componentWillUnmount() {
  }

  get isGroup() {
    return this.props.id.length < 36;
  }

  renderNoAvatar(width) {
    if (this.props.size === Size.large || this.count === 1) {
      return (
        <LargeContainer style={{ width: width, height: width }}>
          <LargeImage
            style={{ width: width, height: width }}
            source={require("../../../assets/images/no-avatar.png")}
          />
        </LargeContainer>
      );
    } else if (this.props.size === Size.aligned) {
      return (
        <AlignedContainer index={this.props.index}>
          <AlignedImage
            source={require("../../../assets/images/no-avatar.png")}
          />
        </AlignedContainer>
      );
    } else if (this.props.size === Size.verylarge) {
      return (
        <VLContainer>
          <VeryLargeImage
            decorate={this.decorate}
            source={require("../../../assets/images/no-avatar.png")}
          />
        </VLContainer>
      );
    } else {
      return (
        <SmallContainer count={this.props.count || 1} index={this.props.index}>
          <SmallImage
            count={this.props.count || 1}
            source={require("../../../assets/images/no-avatar.png")}
          />
        </SmallContainer>
      );
    }
  }

  renderIsGroup(width) {
    if (this.props.size === Size.large || this.count === 1) {
      return (
        <LargeContainer style={{ width: width, height: width }}>
          <LargeImage
            style={{ width: width, height: width }}
            source={require("../../../assets/images/group-avatar.png")}
          />
        </LargeContainer>
      );
    } else if (this.props.size === Size.aligned) {
      return (
        <AlignedContainer index={this.props.index}>
          <AlignedImage
            source={require("../../../assets/images/group-avatar.png")}
          />
        </AlignedContainer>
      );
    } else if (this.props.size === Size.verylarge) {
      return (
        <VLContainer>
          <VeryLargeImage
            decorate={this.decorate}
            source={require("../../../assets/images/group-avatar.png")}
          />
        </VLContainer>
      );
    } else {
      return (
        <SmallContainer count={this.props.count || 1} index={this.props.index}>
          <SmallImage
            count={this.props.count || 1}
            source={require("../../../assets/images/group-avatar.png")}
          />
        </SmallContainer>
      );
    }
  }

  render() {
    let width = 45;
    if (this.props.width) {
      width = this.props.width;
    }

    if (this.isGroup) {
      return this.renderIsGroup(width);
    }

    if (this.state.status == "failed" || !Connection.isOnline) {
      return this.renderNoAvatar(width);
    }
    // TODO we could use react native fast image if we need to make some cache: https://www.npmjs.com/package/react-native-fast-image
    // but react native image should use header cache control like most of browsers so we may not need it
    // see more at: https://blog.rangle.io/image-caching-in-react-native/
    const sharedProps: Partial<ImageProps> = {
      defaultSource: require("../../../assets/images/no-avatar.png"),

      onError: () => {
        this.setState({ status: "failed" });
      },
      onLoadStart: () => {
        this.setState({ status: "loading" });
      },
      onLoad: () => {
        this.setState({ status: "success" })
      }
    };
    //in case of success,initial,loading status...
    if (this.props.size === Size.large || this.count === 1) {
      if (!Conf.currentPlatform) throw new Error("must specify a platform");
      return (
        <LargeContainer style={{ width, height: width }}>
          <LargeImage
            {...sharedProps}
            source={{
              uri: `${Conf.currentPlatform.url}/userbook/avatar/${
                this.props.id
                }?thumbnail=100x100`
            }}
            style={{ width, height: width }}
          />
        </LargeContainer>
      );
    } else if (this.props.size === Size.aligned) {
      if (!Conf.currentPlatform) throw new Error("must specify a platform");
      return (
        <AlignedContainer index={this.props.index}>
          <AlignedImage
            {...sharedProps}
            source={{
              uri: `${Conf.currentPlatform.url}/userbook/avatar/${
                this.props.id
                }?thumbnail=100x100`
            }}
          />
        </AlignedContainer>
      );
    } else if (this.props.size === Size.verylarge) {
      if (!Conf.currentPlatform) throw new Error("must specify a platform");
      return (
        <VLContainer>
          <VeryLargeImage
            {...sharedProps}
            decorate={this.decorate}
            source={{
              uri: `${Conf.currentPlatform.url}/userbook/avatar/${
                this.props.id
                }?thumbnail=150x150`
            }}
          />
        </VLContainer>
      );
    } else {
      if (!Conf.currentPlatform) throw new Error("must specify a platform");
      return (
        <SmallContainer count={this.props.count || 1} index={this.props.index}>
          <SmallImage
            {...sharedProps}
            count={this.props.count || 1}
            source={{
              uri: `${Conf.currentPlatform.url}/userbook/avatar/${
                this.props.id
                }?thumbnail=100x100`
            }}
          />
        </SmallContainer>
      );
    }
  }
}

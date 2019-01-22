import I18n from "i18n-js";
import * as React from "react";
import { ScrollView, View } from "react-native";

import { SingleAvatar } from "../../ui/avatars/SingleAvatar";
import ConnectionTrackingBar from "../../ui/ConnectionTrackingBar";
import {
  ArticleContainer,
  CenterPanel,
  Header,
  LeftPanel,
  PageContainer
} from "../../ui/ContainerContent";
import { DateView } from "../../ui/DateView";
import { ResourceTitle } from "../../ui/headers/ResourceTitle";
import { HtmlContentView } from "../../ui/HtmlContentView";
import { Bold, Light } from "../../ui/Typography";

export class NewsContentHeader extends React.Component<
  { navigation?: any },
  undefined
> {
  render() {
    const { news } = this.props.navigation.state.params;
    return (
      <ResourceTitle
        title={news.title}
        subTitle={news.subtitle}
        navigation={this.props.navigation}
      />
    );
  }
}

// tslint:disable-next-line:max-classes-per-file
export class NewsContent extends React.Component<{ navigation?: any }, {}> {
  constructor(props) {
    super(props);
  }

  public newsContent() {
    const {
      date,
      id,
      images,
      htmlContent,
      message,
      resource,
      resourceId,
      resourceName,
      senderId,
      senderName,
      subtitle,
      title,
      url
    } = this.props.navigation.state.params.news;
    return (
      <View>
        <Header>
          <LeftPanel>
            <SingleAvatar userId={senderId} />
          </LeftPanel>
          <CenterPanel>
            <Bold>
              {senderName}
              <Light> {I18n.t("On")} </Light>
              {subtitle}
            </Bold>
            <DateView date={date} short={false} />
          </CenterPanel>
        </Header>
        {/*
        {this.state.expend ? (
          <Paragraph>{message}</Paragraph>
        ) : (
          <Preview
            textContent={message}
            onExpend={() => this.setState({ expend: true })}
          />
        )}
        <Images images={images} style={message ? { marginTop: 15 } : {}} />
        */}
        <HtmlContentView
          source={url}
          getContentFromResource={responseJSON => responseJSON.content}
          opts={{
            formatting: true,
            hyperlinks: true,
            iframes: true,
            images: true
          }}
          html={htmlContent}
        />
      </View>
    );
  }

  public render() {
    return (
      <PageContainer>
        <ConnectionTrackingBar />
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 20
          }}
        >
          <ArticleContainer>{this.newsContent()}</ArticleContainer>
        </ScrollView>
      </PageContainer>
    );
  }
}

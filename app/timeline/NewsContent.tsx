import style from "glamorous-native"
import * as React from "react"
import { View, Text } from "react-native"
import { layoutSize } from "../constants/layoutSize"
import { INewsModel } from "../model/Timeline"
import { CommonStyles } from "../styles/common/styles";
import { DateView } from "../ui/DateView"
import { tr } from "../i18n/t"
import { CenterPanel, Content, Header, LeftPanel, ArticleContainer, ArticlePage } from "../ui/ContainerContent"
import { Images } from "../ui/Images"
import { Card, TouchCard } from '../ui/Card';
import { SingleAvatar } from "../ui/avatars/SingleAvatar";
import { Bold, Light, Paragraph, A } from "../ui/Typography";
import { Preview } from "../ui/Preview";

export class NewsContent extends React.Component<{ navigation?: any }, { expend: boolean }> {
    state = { expend: false }

    newsContent(){
        const { date, senderId, senderName, resourceName, message, images } = this.props.navigation.state.params;
        return (
            <View>
                <Header>
                            <LeftPanel>
                        <SingleAvatar userId={senderId} />
                    </LeftPanel>
                    <CenterPanel>
                        <Bold>
                            {senderName}
                            <Light> {tr.On} </Light>
                            {resourceName}
                        </Bold>
                        <DateView date={date} short={false} />
                    </CenterPanel>
                </Header>
                { this.state.expend ? <Paragraph>{ message }</Paragraph> : <Preview textContent={ message } /> }
                <Images images={images} />
            </View>
        )
    }

	render() {
        if(!this.state.expend){
            return (
                <ArticleContainer>
                    <TouchCard onPress={ () => this.setState({ expend: true })}>
                        { this.newsContent() }
                    </TouchCard>
                </ArticleContainer>
            )
        }
		return (
			<ArticlePage>
				<Card>
                    { this.newsContent() }
				</Card>
			</ArticlePage>
		)
	}
}

const Margin = style.view({
	height: layoutSize.LAYOUT_10,
})

const Image = style.image({
	height: layoutSize.LAYOUT_160,
	width: layoutSize.LAYOUT_350,
})
import * as React from "react"
import {FlatList, Text, View } from "react-native"
import Swipeable from "react-native-swipeable"
import Icon from "react-native-vector-icons/MaterialIcons"
import { InboxStyle } from "../styles/Inbox"
import { getSeqNumber } from "../utils/Store"
import {Avatars} from "./ui/Avatars/Avatars"
import {ConversationModel} from "../model/Conversation";
import styles from "./styles"
import {Col, ColProperties} from "./ui/Col";
import {Row} from "./ui/Row";
import {DateView} from "./ui/DateView";
import {NonLu} from "./ui/NonLu";
import {clean, trunc} from "../utils/html"
import {layoutSize} from "../constants/layoutSize";
import style from "glamorous-native"
import {CommonStyles} from "./styles/common/styles";


const swipeoutBtns = [
	<View style={InboxStyle.hiddenButtons}>
		<Icon name="notifications-off" />
	</View>,
	<View style={InboxStyle.hiddenButtons}>
		<Icon name="delete" />
	</View>,
]

const ColImage = (props: ColProperties) => (
    <Col
        alignItems="center"
        justifyContent="center"
		width={layoutSize.LAYOUT_50}
        {...props}
    />
)

const ColBody= (props: ColProperties) => (
    <Col
        alignItems="flex-start"
        justifyContent="center"
        padding={layoutSize.LAYOUT_2}
        size={1}
        {...props}
    />
)

const ColRight= (props: ColProperties) => (
    <Col
        alignItems="center"
        justifyContent="space-around"
        width={layoutSize.LAYOUT_50}
        {...props}
    />
)

const Author = style.text( {
    fontFamily: CommonStyles.primaryFontFamilySemibold,
	fontSize: layoutSize.LAYOUT_14
})

const Content = style.text( {
    fontFamily: CommonStyles.primaryFontFamilyLight,
    fontSize: layoutSize.LAYOUT_12,
	marginTop: layoutSize.LAYOUT_10
})

export interface ConversationProps {
	conversations: any
	navigation?: any
	readConversation: (number) => void
}

export class Conversation extends React.Component<ConversationProps, any> {
	public componentWillMount() {
		this.props.readConversation(0)
	}

	public renderItem({ subject, body, date, displayNames, nb } : ConversationModel ) {
		return (
			<Swipeable rightButtons={swipeoutBtns}>
				<Row style={styles.item}>
					<ColImage>
						<Avatars displayNames={displayNames} />
					</ColImage>
					<ColBody>
						<Author>{trunc(subject, 35)}</Author>
						{body.length > 0 ? <Content>{clean(body, 40)}</Content> : <View/>}
					</ColBody>
					<ColRight>
						<DateView date={date} />
						<NonLu nb={nb}/>
					</ColRight>
				</Row>
			</Swipeable>
		)
	}

	public render() {
		const { conversations } = this.props

		return (
			<FlatList
				data={conversations}
				keyExtractor={() => getSeqNumber()}
				renderItem={({ item }) => this.renderItem(item)}
				style={styles.grid}
			/>
		)
	}
}

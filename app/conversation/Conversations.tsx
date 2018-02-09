import style from "glamorous-native"
import * as React from "react"
import { OptimizedFlatList } from "react-native-optimized-flatlist"
import Swipeable from "react-native-swipeable"
import { layoutSize } from "../constants/layoutSize"
import { IThreadModel } from "../model/Thread"
import styles from "../styles/index"
import { Icon } from "../ui/icons/Icon"
import { Conversation } from "./Conversation"
import { getSeqNumber } from "../utils/Store"

export interface IConversationsProps {
	conversations: IThreadModel[]
	navigation?: any
	readNextThreads?: () => void
	readPrevThreads?: () => void
}

export class Conversations extends React.Component<IConversationsProps, any> {
	public onPress(id: string, displayNames: string[][], subject: string) {
		const { readNextThreads, readPrevThreads } = this.props

		this.props.navigation.navigate("Threads", {
			conversationId: id,
			displayNames,
			readNextThreads,
			readPrevThreads,
			subject,
		})
	}

	public render() {
		const { conversations } = this.props

		return (
			<OptimizedFlatList
				data={conversations}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => this.renderItem(item)}
				style={styles.grid}
			/>
		)
	}

	private renderItem(item: IThreadModel) {
		return (
			<Swipeable rightButtons={swipeoutBtns}>
				<Conversation {...item} onPress={(id, displayNames, subject) => this.onPress(id, displayNames, subject)} />
			</Swipeable>
		)
	}
}

const RightButton = style.touchableOpacity({
	backgroundColor: "#EC5D61",
	flex: 1,
	justifyContent: "center",
	paddingLeft: layoutSize.LAYOUT_34,
})

const swipeoutBtns = [
	<RightButton>
		<Icon size={layoutSize.LAYOUT_18} color="#ffffff" name="trash" />
	</RightButton>,
]

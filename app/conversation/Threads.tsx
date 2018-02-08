import style from "glamorous-native"
import * as React from "react"
import { View } from "react-native"
import { OptimizedFlatList } from "react-native-optimized-flatlist"
import { IThreadModel } from "../model/Thread"
import styles from "../styles/index"
import { Thread } from "./Thread"
import { sameDay } from "../utils/date"
import { Row } from "../ui"
import { tr } from "../i18n/t"
import {getSeqNumber} from "../utils/Store";

export interface IThreadsProps {
	navigation?: any
	threads: IThreadModel[]
	userId: string
}

export class Threads extends React.Component<IThreadsProps, any> {
	public static tryUpScroll = 0
	public alreadyDisplayTodayDate: boolean = false

	public render() {
		const { threads } = this.props
		const { conversationId, readNextThreads, readPrevThreads } = this.props.navigation.state.params

		return (
			<OptimizedFlatList
				data={threads}
				keyExtractor={() => getSeqNumber()}
				onEndReached={() => {
					readNextThreads(conversationId)
				}}
				onScroll={event => {
					if (event.nativeEvent.contentOffset.y < -200) {
						readPrevThreads(conversationId)
					}
				}}
				onEndReachedThreshold={0.1}
				renderItem={({ item }) => this.renderItem(item)}
				style={styles.grid}
			/>
		)
	}

	private showTodayDate(item) {
		if (this.alreadyDisplayTodayDate) return false

		if (sameDay(item)) {
			this.alreadyDisplayTodayDate = true
			return true
		}
		return false
	}

	private displayTodayDate() {
		return (
			<Row>
				<Border />
				<Text>{tr.today}</Text>
				<Border />
			</Row>
		)
	}

	private renderItem(item: IThreadModel) {
		if (!this.props.userId) {
			return <View />
		}

		return (
			<View>
				{this.showTodayDate(item) && this.displayTodayDate()}
				<Thread {...item} userId={this.props.userId} />
			</View>
		)
	}
}

const Border = style.view({
	backgroundColor: "#DCDDE0",
	flex: 1,
	height: 1,
})

const Text = style.text({
	alignSelf: "center",
	color: "#FF858FA9",
})
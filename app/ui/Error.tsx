import style from "glamorous-native"
import * as React from "react"
import { View } from "react-native";
import { IMessagesProps } from "../model/messages"
import { CommonStyles } from "../styles/common/styles"

export interface ErrorProps {
	errCodes: string[]
	messages?: IMessagesProps[]
}

const Message = style.text({
	alignSelf: "center",
	color: CommonStyles.errorColor,
	height: 32,
	fontFamily: CommonStyles.primaryFontFamily,
	fontSize: 14,
	paddingTop: 4,
	flex: 1,
})

export const hasErrorsMessage = ({ errCodes, messages }: ErrorProps): string => {
	const { status, statusText = "" } = messages[0]

	if (status !== 0 && errCodes.indexOf(statusText) >= 0) {
		return statusText
	}

	return ""
}

export const Error = (props: ErrorProps) => {
	const errMessage = hasErrorsMessage(props)

	if (errMessage.length > 0) {
		return <Message>{errMessage}</Message>
	}

	return <View />
}

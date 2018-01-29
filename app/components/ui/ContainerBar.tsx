import style from "glamorous-native"
import * as React from "react"
import { layoutSize } from "../../constants/layoutSize"
import { CommonStyles } from "../styles/common/styles"

export const ContainerBar = style.view(
	{
		alignItems: "flex-start",
		backgroundColor: CommonStyles.mainColorTheme,
		elevation: 5,
		flexDirection: "row",
		justifyContent: "space-around",
		shadowColor: CommonStyles.shadowColor,
		shadowOffset: CommonStyles.shadowOffset,
		shadowOpacity: CommonStyles.shadowOpacity,
		shadowRadius: CommonStyles.shadowRadius,
	},
	({ collapse }) => ({
		height: collapse ? layoutSize.LAYOUT_51 : layoutSize.LAYOUT_200,
		paddingTop: collapse ? layoutSize.LAYOUT_0 : layoutSize.LAYOUT_20,
	})
)

export const LeftPanel = style.touchableOpacity({
	alignItems: "flex-start",
	height: layoutSize.LAYOUT_48,
	justifyContent: "flex-start",
	paddingHorizontal: layoutSize.LAYOUT_20,
	paddingVertical: layoutSize.LAYOUT_14,
	width: layoutSize.LAYOUT_60,
})

export const RightPanel = style.touchableOpacity({
	alignItems: "flex-end",
	height: layoutSize.LAYOUT_48,
	justifyContent: "flex-start",
	paddingHorizontal: layoutSize.LAYOUT_20,
	paddingVertical: layoutSize.LAYOUT_14,
	width: layoutSize.LAYOUT_60,
})

export const CenterPanel = style.touchableOpacity({
	alignItems: "center",
	flex: 1,
	justifyContent: "center",
	paddingTop: layoutSize.LAYOUT_2,
})

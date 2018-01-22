import styled from "glamorous-native"
import * as React from "react"
import { layoutSize } from "../../constants/layoutSize"
import { RowProperties } from "../index"
import { Row } from "./Row"

const Container = (props: RowProperties) => (
	<Row
		alignItems="center"
		backgroundColor="white"
		borderBottomColor="#dddddd"
		borderBottomWidth={1}
		height={layoutSize.LAYOUT_46}
		justifyContent="flex-start"
		marginTop={layoutSize.LAYOUT_20}
		paddingHorizontal={layoutSize.LAYOUT_13}
		{...props}
	/>
)

const Deconnect = styled.text({
	color: "#F64D68",
	fontSize: layoutSize.LAYOUT_14,
})

export interface ButtonTextProps {
	onPress: () => any
}

export const ButtonDeconnect = ({ onPress }: ButtonTextProps) => (
	<Container onPress={() => onPress()}>
		<Deconnect>Se déconnecter</Deconnect>
	</Container>
)

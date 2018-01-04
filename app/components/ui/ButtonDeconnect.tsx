import * as React from "react"
import {StyleSheet, Text, TouchableOpacity, View} from "react-native"
import {layoutSize} from "../../constants/layoutSize";


const styles = StyleSheet.create({
	container: {
		alignItems: "flex-end",
		backgroundColor: "white",
		flex: 0,
		flexDirection: "row",
		justifyContent: "flex-start",
		marginTop: layoutSize.LAYOUT_20,
		paddingTop:layoutSize.LAYOUT_10,
        paddingBottom: layoutSize.LAYOUT_2,
		paddingHorizontal: layoutSize.LAYOUT_13,
	},
    text: {
        color: "#F64D68",
    }
})

export interface ButtonTextProps {
	onPress: () => any
}

export const ButtonDeconnect = ({
	onPress,
}: ButtonTextProps) => {
	return (
        <View style={styles.container} >
			<TouchableOpacity onPress={onPress}>
				<Text style={styles.text}>
					Se déconnecter
				</Text>
			</TouchableOpacity>
		</View>
	)
}

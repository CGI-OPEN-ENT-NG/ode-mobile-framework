import * as React from "react"
import { View, Text } from "react-native";
import { Header, Title, SubTitle } from './Header';
import { Back } from "./Back";

export const ResourceTitle = ({ title, subTitle, navigation }) => (
	<Header>
		<Back navigation={ navigation } />
		<View style={{ justifyContent: 'center', flex: 1, height: 60 }}>
			<Title numberOfLines={ 2 } style={{ lineHeight: 18 }}>{ title }</Title>
			<SubTitle numberOfLines={ 1 } style={{ lineHeight: 14 }}>{ subTitle }</SubTitle>
		</View>
	</Header>
)
import style from "glamorous-native";
import * as React from "react";

import { Back } from "../../ui/headers/Back";
import { AppTitle, Header } from "../../ui/headers/Header";

export interface IDiaryTaskPageHeaderProps {
  navigation?: any;
  title?: string;
}

export const DiaryTaskPageHeader = ({
  navigation,
  title
}: IDiaryTaskPageHeaderProps) => {
  const AppTitleStyled = style(AppTitle)({ textAlign: "left" });
  return (
    <Header>
      <Back navigation={this.props.navigation} />
      <AppTitleStyled>{this.props.title}</AppTitleStyled>
    </Header>
  );
};

export default DiaryTaskPageHeader;

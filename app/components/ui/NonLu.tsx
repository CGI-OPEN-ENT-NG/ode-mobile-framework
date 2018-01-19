import * as React from "react"
import style from "glamorous-native"
import {CommonStyles} from "../styles/common/styles";
import {layoutSize} from "../../constants/layoutSize";
const View = style.view()

const ViewNB = style.view( {
    alignSelf: 'center',
    backgroundColor: CommonStyles.mainColorTheme,
    borderRadius: layoutSize.LAYOUT_8,
    paddingVertical: layoutSize.LAYOUT_3,
    paddingHorizontal: layoutSize.LAYOUT_6
})

const Text = style.text( {
    alignSelf: 'center',
    color: 'white',
    fontSize: layoutSize.LAYOUT_10,
    fontFamily: CommonStyles.primaryFontFamilyLight
})

export const NonLu = ({ nb }) => {
    if (nb === 0)
        return (<View/>)

    return (
        <ViewNB>
            <Text>{nb}</Text>
        </ViewNB>
    )
}

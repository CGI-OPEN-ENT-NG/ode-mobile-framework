import style from "glamorous-native";
import I18n from "i18n-js";
import * as React from "react";

import { GridAvatars } from "../../ui/avatars/GridAvatars";
import { CircleNumber } from "../../ui/CircleNumber";
import {
  CenterPanel,
  Content,
  LeftPanel,
  ListItem,
  RightPanel
} from "../../ui/ContainerContent";
import { DateView } from "../../ui/DateView";

import { Me } from "../../infra/Me";
import { CommonStyles } from "../../styles/common/styles";

import { FontWeight } from "../../ui/text";
import { IConversationThread } from "../reducers/threadList";

export interface IThreadItemProps extends IConversationThread {
  onPress: (id: string, displayNames: string[][], subject: string) => void;
}

export default ({
  id,
  subject,
  date,
  displayNames,
  unread,
  onPress,
  to,
  from,
  cc,
  ...others
}: IThreadItemProps) => {
  // console.log("ThreadItem", subject, `from "${from}" to`, to, cc, others);
  // console.log("ThreadItem", subject, findReceivers2(to, from, cc));
  return (
    <ListItem nb={unread} onPress={() => onPress(id, displayNames, subject)}>
      <LeftPanel>
        <GridAvatars users={findReceivers2(to, from, cc)} />
      </LeftPanel>
      <CenterPanel>
        <Author nb={unread} numberOfLines={1}>
          {findReceivers2(to, from, cc)
            .map(r => {
              const u = displayNames.find(dn => dn[0] === r);
              return u ? u[1] : I18n.t("unknown-user");
            })
            .join(", ")}
        </Author>
        {subject && subject.length ? (
          <Content nb={unread} numberOfLines={1}>
            {subject}
          </Content>
        ) : (
          <style.View />
        )}
      </CenterPanel>
      <RightPanel>
        <DateView date={date} strong={unread > 0} />
        <CircleNumber nb={unread} />
      </RightPanel>
    </ListItem>
  );
};

const Author = style.text(
  {
    color: CommonStyles.textColor,
    fontFamily: CommonStyles.primaryFontFamily,
    fontSize: 14
  },
  ({ nb }) => ({
    fontWeight: nb > 0 ? FontWeight.SemiBold : FontWeight.Normal
  })
);

/**
 * Make a curated list of receivers from message information (from, to, cc).
 * The result excludes the user itself, except if it's the only one.
 * to, from and cc must contain userIds.
 * @param to
 * @param from
 * @param cc
 */
export const findReceivers = (to, from, cc) => {
  cc = cc || [];
  const newTo = from
    ? [...to, ...cc, from].filter(el => el !== Me.session.userId)
    : [...to, ...cc].filter(el => el !== Me.session.userId);
  if (newTo.length === 0) {
    return [Me.session.userId];
  }
  return newTo;
};

export const findReceivers2 = (to, from, cc) => {
  cc = cc || [];
  const receiversSet = new Set(
    // By using a Set we guarantee that we'll not have duplicates
    from
      ? [...to, ...cc, from].filter(el => el !== Me.session.userId)
      : [...to, ...cc].filter(el => el !== Me.session.userId)
  );
  if (receiversSet.size === 0) {
    receiversSet.add(Me.session.userId);
  }
  return [...receiversSet];
};

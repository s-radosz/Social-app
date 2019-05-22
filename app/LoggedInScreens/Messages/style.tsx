import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from "react-native";

import {
  pageTitleWhite,
  peachColor,
  darkGrayColor,
  btnFullWidth,
  lightBorderRadius,
  btnFullWidthContainer,
  btnFullActiveWidthContainer,
  fontSizeBig,
  fontSizeMedium
} from "./../../assets/global/globalStyles";

interface Style {
  container: ViewStyle;
  pageTitle: any;
  filterBtnText: TextStyle;
  userListSingleUserContainer: TextStyle;
  filterBtnTextActive: TextStyle;
  pageSubTitle: TextStyle;
  productListSingleProductContainer: ViewStyle;
  singleButtonCol2Container: ViewStyle;
  filterBtnContainer: ViewStyle;
  messageDetailsContainer: ViewStyle;
  messagesList: ViewStyle;
  productListSingleProductImage: ImageStyle;
  userListContainer: ViewStyle;
  filterBtnActive: TextStyle;
  productListSingleProductTextContainer: ViewStyle;
  conversationBoxContainer: ViewStyle;
  image: ImageStyle;
  unreadedConversation: TextStyle;
  readedConversation: TextStyle;
  senderBox: TextStyle;
  receiverBox: TextStyle;
  messageDateSender: TextStyle;
  messageDateReceiver: TextStyle;
  filterBtn: any;
  viewContainer: ViewStyle;
  sendMessageBtn: any;
  sendMessage: ViewStyle;
  messageListContainer: ViewStyle;
}

export default StyleSheet.create<Style>({
  messageListContainer: {
    paddingLeft: 10,
    paddingRight: 10
  },
  container: {
    position: "relative",
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  sendMessageBtn: btnFullWidth,
  filterBtnText: { color: "#9F9F9F", textAlign: "center", paddingTop: 7 },
  filterBtnTextActive: { color: "#000", textAlign: "center", paddingTop: 7 },
  filterBtnActive: {
    borderBottomColor: peachColor,
    borderBottomWidth: 3,
    paddingBottom: 20
  },
  filterBtnContainer: {
    position: "relative",
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row",
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    marginBottom: 10
  },
  filterBtn: { paddingBottom: 20 },
  messageDetailsContainer: {
    position: "relative",
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row",
    paddingBottom: 10,
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1,
    marginBottom: 5
  },
  pageSubTitle: {
    textAlign: "center",
    color: "#333",
    fontWeight: "400",
    fontSize: 14,
    paddingBottom: 20
  },
  productListSingleProductImage: {
    width: 50,
    height: 50,
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
    borderRadius: 25
  },
  productListSingleProductTextContainer: {
    paddingLeft: 10,
    width: "85%"
  },
  userListSingleUserContainer: {
    width: "96%",
    margin: "2%",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: lightBorderRadius,
    height: 180
  },
  messagesList: {
    flexWrap: "wrap",
    alignItems: "flex-start",
    flexDirection: "row"
  },
  userListContainer: {
    width: "100%",
    /*position: "relative",*/
    flex: 1,
    margin: 8
  },
  pageTitle: pageTitleWhite,
  conversationBoxContainer: { borderWidth: 1, width: "100%" },
  image: { width: 45, height: 45 },
  unreadedConversation: { color: peachColor, textAlign: "left" },
  readedConversation: { color: "#333", textAlign: "left", fontSize: 12 },
  senderBox: {
    width: "80%",
    textAlign: "right",
    alignSelf: "flex-end",
    backgroundColor: "#ededed",
    fontSize: 12,
    padding: 5,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10
  },
  productListSingleProductContainer: {
    width: "100%",
    borderWidth: 1,
    flexWrap: "wrap",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: lightBorderRadius,
    marginBottom: 10,
    paddingLeft: 10
  },
  singleButtonCol2Container: {
    width: "46%",
    marginLeft: "2%",
    marginRight: "2%",
    marginTop: "3%"
  },
  receiverBox: {
    width: "80%",
    backgroundColor: peachColor,
    fontSize: 12,
    padding: 5,
    marginLeft: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    color: "#fff"
  },
  messageDateSender: {
    width: "80%",
    textAlign: "right",
    alignSelf: "flex-end",
    fontSize: 10,
    marginRight: 10
  },
  messageDateReceiver: {
    width: "80%",
    textAlign: "left",
    alignSelf: "flex-start",
    fontSize: 12,
    marginLeft: 10
  },
  viewContainer: {
    width: "100%"
    /*flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"*/
  },
  sendMessage: {}
});

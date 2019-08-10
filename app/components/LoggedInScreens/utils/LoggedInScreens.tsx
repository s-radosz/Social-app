import React, { Suspense, useContext } from "react";
import { ScrollView, Text } from "react-native";
import { GlobalContext } from "./../../Context/GlobalContext";

const FindUsers = React.lazy(() => import("./../FindUsers/FindUsers"));
const Auctions = React.lazy(() => import("./../Auctions/Auctions"));
const Messages = React.lazy(() => import("./../Messages/Messages"));
const Forum = React.lazy(() => import("./../Forum/Forum"));
const Profile = React.lazy(() => import("./../Profile/Profile"));
const FeedbackModal = React.lazy(() => import("./FeedbackModal"));

const LoggedInScreens = (props: any) => {
  const context = useContext(GlobalContext);

  return (
    <ScrollView
      data-test="LoggedInScreens"
      keyboardShouldPersistTaps={"always"}
    >
      {props.openFindUsers && !props.showFeedbackModal && (
        <Suspense fallback={<Text>Wczytywanie...</Text>}>
          <FindUsers
            openMessages={props.setOpenMessages}
            openFindUserId={props.openFindUserId}
            setOpenProfile={props.setOpenProfile}
            navigation={props.navigation}
            data-test="FindUsers"
          />
        </Suspense>
      )}

      {props.openAuctions && !props.showFeedbackModal && (
        <Suspense fallback={<Text>Wczytywanie...</Text>}>
          <Auctions
            openMessages={props.setOpenMessages}
            openAuctionId={props.openAuctionId}
            openAuctionUserId={props.openAuctionUserId}
            data-test="Auctions"
          />
        </Suspense>
      )}

      {props.openMessages && !props.showFeedbackModal && (
        <Suspense fallback={<Text>Wczytywanie...</Text>}>
          <Messages data-test="Messages" navigation={props.navigation} />
        </Suspense>
      )}

      {props.openForum && !props.showFeedbackModal && (
        <Suspense fallback={<Text>Wczytywanie...</Text>}>
          <Forum
            setShowFeedbackModal={props.setShowFeedbackModal}
            data-test="Forum"
          />
        </Suspense>
      )}

      {props.openProfile && !props.showFeedbackModal && (
        <Suspense fallback={<Text>Wczytywanie...</Text>}>
          <Profile
            showUserFriends={false}
            setOpenFindUsers={props.setOpenFindUsers}
            setOpenAuctions={props.setOpenAuctions}
            navigation={props.navigation}
            openMessages={props.setOpenMessages}
            openForum={props.setOpenForum}
            setShowFeedbackModal={props.setShowFeedbackModal}
            data-test="Profile"
          />
        </Suspense>
      )}

      {props.showFeedbackModal && (
        <Suspense fallback={<Text>Wczytywanie...</Text>}>
          <FeedbackModal
            setFeedbackMessage={props.setFeedbackMessage}
            feedbackMessage={props.feedbackMessage}
            sendFeedback={props.sendFeedback}
            feedbackTopic={props.feedbackTopic}
            setFeedbackTopic={props.setFeedbackTopic}
            activeTopic={props.activeTopic}
          />
        </Suspense>
      )}
    </ScrollView>
  );
};

export default LoggedInScreens;

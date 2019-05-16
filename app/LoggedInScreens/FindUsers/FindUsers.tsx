import React, { Component } from "react";
import {
  Platform,
  ImageBackground,
  Text,
  View,
  Button,
  TouchableHighlight
} from "react-native";
import axios from "axios";
import findUsersBg from "./../../assets/images/findUsersBgMin.jpg";
import UserOnList from "./utils/UserOnList";
import UserDetails from "./utils/UserDetails";
import UserMessageBox from "./utils/UserMessageBox";
import Carousel from "react-native-snap-carousel";
import FilterModal from "./../inc/FilterModal";
import { btnFullWidthFilledContainer } from "./../../assets/global/globalStyles";
import { v4 as uuid } from "uuid";
import styles from "./style";

interface FindUsersState {
  userList: any;
  showUserDetails: boolean;
  showUserMessageBox: boolean;
  message: string;
  alertMessage: string;
  alertType: string;
  usersAreInTheSameConversation: boolean;
  userDetailsData: any;
  userDetailsId: number;
  filterOptions: any;
  filterDistance: number;
  filterChildAge: string;
  filterChildGender: string;
  filterHobby: string;
  showFilterModal: boolean;
  filterData: any;
}

interface FindUsersProps {
  API_URL: string;
  user: {
    id: number;
    lattitude: number;
    longitude: number;
  };
  openMessages: any;
}

export default class FindUsers extends Component<
  FindUsersProps,
  FindUsersState
> {
  constructor(props: FindUsersProps) {
    super(props);
    this.state = {
      userList: [],
      filterData: [{ text: "test1" }, { text: "test2" }],
      filterDistance: 0,
      filterChildAge: "",
      filterChildGender: "",
      filterHobby: "",
      showFilterModal: false,
      showUserDetails: false,
      showUserMessageBox: false,
      message: "",
      alertMessage: "",
      alertType: "",
      usersAreInTheSameConversation: false,
      userDetailsData: [],
      userDetailsId: 0,
      filterOptions: [
        {
          title: "Odległosć",
          index: 0
        },
        {
          title: "Wiek dziecka",
          index: 1
        },
        {
          title: "Płeć dziecka",
          index: 2
        },
        {
          title: "Hobby",
          index: 2
        }
      ]
    };

    this.loadUsersNearCoords = this.loadUsersNearCoords.bind(this);
    this.setShowUserDetails = this.setShowUserDetails.bind(this);
    this.hideShowUserDetails = this.hideShowUserDetails.bind(this);
    this.setShowUserMessageBox = this.setShowUserMessageBox.bind(this);
    this.hideShowUserMessageBox = this.hideShowUserMessageBox.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.setUserDetailsId = this.setUserDetailsId.bind(this);
    this.setShowFilterModal = this.setShowFilterModal.bind(this);
    this.renderItem = this.renderItem.bind(this);
  }

  setShowFilterModal = (): void => {
    console.log("setShowFilterModal");
    this.setState({ showFilterModal: !this.state.showFilterModal });
  };

  renderItem(item: any, index: any) {
    console.log(item.item);
    return (
      <TouchableHighlight
        style={btnFullWidthFilledContainer}
        onPress={() => this.setShowFilterModal()}
      >
        <Text
          style={{
            fontSize: 14,
            textAlign: "center",
            lineHeight: 30,
            color: "#333"
          }}
        >
          {item.item.title}
        </Text>
      </TouchableHighlight>
    );
  }

  setUserDetailsId = (id: number) => {
    this.setState({ userDetailsId: id });
  };

  sendMessage = (message: string): void => {
    let API_URL = this.props.API_URL;
    let senderId = this.props.user.id;
    let receiverId = this.state.userDetailsId;

    let that = this;

    axios
      .post(API_URL + "/api/saveConversation", {
        senderId: senderId,
        receiverId: receiverId,
        message: message
      })
      .then(function(response2) {
        console.log(response2);
        if (response2.data.status === "OK") {
          that.setState({
            alertType: "success",
            alertMessage: "Poprawnie wysłano nową wiadomość"
          });

          that.setShowUserDetails(that.state.userDetailsId);
        } else if (response2.data.status === "ERR") {
          that.setState({
            alertType: "warning",
            alertMessage: response2.data.result
          });
        }
      })
      .catch(function(error) {
        console.log(error);

        that.setState({
          alertType: "danger",
          alertMessage: "Nie udało się wysłać wiadomości"
        });
      });
  };

  setShowUserDetails = async (userId: number) => {
    //check if users are in the same conversation - start messaging
    let API_URL = this.props.API_URL;
    /*let searchedUser = userId;*/
    let loggedInUser = this.props.user.id;

    let that = this;

    await this.setState({ userDetailsId: 0, userDetailsData: [] });

    axios
      .post(API_URL + "/api/loadUserById", {
        userId: userId,
        loggedInUser: loggedInUser
      })
      .then(function(response) {
        if (response.data.status === "OK") {
          console.log(["loadUserById", response.data.result.user]);

          that.setState({
            userDetailsId: userId,
            userDetailsData: response.data.result.user,
            usersAreInTheSameConversation:
              response.data.result.checkIfUsersAreInNormalConversation
          });
        }
      })
      .catch(function(error) {
        console.log(error);

        that.setState({
          alertType: "danger",
          alertMessage: "Nie udało się pobrać danych o uzytkowniku"
        });
      });
    this.setState({ showUserDetails: true, showUserMessageBox: false });
  };

  hideShowUserDetails = (): void => {
    this.setState({ showUserDetails: false, showUserMessageBox: false });
  };

  setShowUserMessageBox = (): void => {
    this.setState({ showUserMessageBox: true, showUserDetails: false });
  };

  hideShowUserMessageBox = (): void => {
    this.setState({ showUserMessageBox: false, showUserDetails: true });
  };

  loadUsersNearCoords = (): void => {
    try {
      let API_URL = this.props.API_URL;
      let lat = this.props.user.lattitude;
      let lng = this.props.user.longitude;

      let that = this;

      axios
        .post(API_URL + "/api/loadUsersNearCoords", {
          lat: lat,
          lng: lng
        })
        .then(function(response) {
          if (response.data.status === "OK") {
            console.log(response.data);

            that.setState({ userList: response.data.result });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  componentDidMount = (): void => {
    if (
      this.props.user &&
      this.props.user.lattitude &&
      this.props.user.longitude
    ) {
      this.loadUsersNearCoords();
    }
    //this.loadUsersNearCoords();
  };

  render() {
    const {
      userList,
      showUserDetails,
      alertMessage,
      alertType,
      showUserMessageBox,
      usersAreInTheSameConversation,
      userDetailsData
    } = this.state;
    return (
      <View>
        <ImageBackground source={findUsersBg} style={{ width: "100%" }}>
          <Text style={styles.pageTitle}>
            Poznaj mamy
            {"\n"}w okolicy.
          </Text>
        </ImageBackground>

        <View style={styles.container}>
          {showUserDetails && !showUserMessageBox && userDetailsData && (
            <UserDetails
              hideShowUserDetails={this.hideShowUserDetails}
              API_URL={this.props.API_URL}
              user={userDetailsData}
              usersAreInTheSameConversation={usersAreInTheSameConversation}
              openMessages={this.props.openMessages}
              setShowUserMessageBox={this.setShowUserMessageBox}
              alertMessage={alertMessage}
              alertType={alertType}
            />
          )}
          {showUserMessageBox && !showUserDetails && userDetailsData && (
            <UserMessageBox
              hideShowUserMessageBox={this.hideShowUserMessageBox}
              sendMessage={this.sendMessage}
              alertMessage={alertMessage}
              alertType={alertType}
            />
          )}

          {!showUserMessageBox &&
            !showUserDetails &&
            userList &&
            this.state.showFilterModal && (
              <FilterModal filterOptions={this.state.filterData} />
            )}

          {!showUserMessageBox &&
            !showUserDetails &&
            userList &&
            !this.state.showFilterModal && (
              <View>
                <Text style={{ paddingLeft: 10, paddingTop: 10 }}>
                  Filtruj wyniki
                </Text>
                <View style={{ paddingLeft: 10, paddingRight: 10 }}>
                  <Carousel
                    layout={"default"}
                    activeSlideAlignment={"start"}
                    data={this.state.filterOptions}
                    renderItem={this.renderItem}
                    itemWidth={100}
                    sliderWidth={styles.fullWidth}
                  />
                </View>
              </View>
            )}

          {!showUserMessageBox &&
            !showUserDetails &&
            userList &&
            !this.state.showFilterModal &&
            userList.map((user: any, i: number) => {
              //console.log(`${this.props.API_URL}/userPhotos/${user.photo_path}`);

              if (user.id != this.props.user.id) {
                return (
                  <UserOnList
                    API_URL={this.props.API_URL}
                    key={uuid()}
                    user={user}
                    senderId={this.props.user.id}
                    openMessages={this.props.openMessages}
                    alertMessage={alertMessage}
                    alertType={alertType}
                    setShowUserDetails={this.setShowUserDetails}
                    setUserDetailsId={this.setUserDetailsId}
                  />
                );
              }
            })}
        </View>
      </View>
    );
  }
}

import React, { Component, Suspense } from "react";
import { View, Text, NativeModules, Image } from "react-native";
import axios from "axios";
import Geocode from "react-geocode";
import styles from "./style";
const loaderImage: any = require("./../../../assets/images/loader.gif");
var ImagePicker = NativeModules.ImageCropPicker;

const AgeDescScreen = React.lazy(() => import("./utils/AgeDescScreen"));
const PhotoScreen = React.lazy(() => import("./utils/PhotoScreen"));
const CoordsScreen = React.lazy(() => import("./utils/CoordsScreen"));
const ChooseKidsScreen = React.lazy(() => import("./utils/ChooseKidsScreen"));
const ChooseHobbiesScreen = React.lazy(() =>
  import("./utils/ChooseHobbiesScreen")
);

// set Google Maps Geocoding API for purposes of quota management. Its optional but recommended.
Geocode.setApiKey("AIzaSyDk3FIFmkVy87I4hq2fdJ1x6H_mDa96I30");

interface NavigationScreenInterface {
  navigation: {
    navigate: any;
    getParam: any;
    state: any;
  };
}

interface FillNecessaryInfoState {
  age: number;
  desc: string;
  kids: any;
  hobbies: any;
  actualStep: number;
  photo: any;
  actualKidName: string;
  actualKidDate: string;
  actualKidGender: string;
  region: any;
  userSavedPhoto: string;
  locationString: string;
  loader: boolean;
}

export default class FillNecessaryInfo extends Component<
  NavigationScreenInterface,
  FillNecessaryInfoState
> {
  constructor(props: NavigationScreenInterface) {
    super(props);
    this.state = {
      age: 0,
      desc: "",
      kids: [],
      hobbies: [],
      actualStep: 1,
      photo: null,
      locationString: "",
      userSavedPhoto: "",
      actualKidName: "",
      actualKidDate: "2016-05-15",
      actualKidGender: "female",
      loader: false,
      region: {
        latitude: 52.237049,
        longitude: 21.017532,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.handleChoosePhoto = this.handleChoosePhoto.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
    this.submitData = this.submitData.bind(this);
    this.setActualKidName = this.setActualKidName.bind(this);
    this.addKid = this.addKid.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.setActualKidDate = this.setActualKidDate.bind(this);
    this.saveUserData = this.saveUserData.bind(this);
    this.saveUserKids = this.saveUserKids.bind(this);
    this.getAllHobbies = this.getAllHobbies.bind(this);
    this.changeHobbyStatus = this.changeHobbyStatus.bind(this);
    this.saveHobbies = this.saveHobbies.bind(this);
    this.setGender = this.setGender.bind(this);
    this.cleanUserKids = this.cleanUserKids.bind(this);
    this.cleanUserHobbies = this.cleanUserHobbies.bind(this);
    this.removeKidFromState = this.removeKidFromState.bind(this);
    this.userLocationString = this.userLocationString.bind(this);
  }

  componentDidMount = async () => {
    const navigation = this.props.navigation;

    if (navigation.getParam("user")) {
      console.log(
        navigation.getParam("user").age,
        navigation.getParam("user").description,
        navigation.getParam("user").hobbies,
        navigation.getParam("user").kids,
        navigation.getParam("user").photo_path,
        navigation.getParam("user").lattitude
      );
      this.setState({
        age: navigation.getParam("user").age,
        desc: navigation.getParam("user").description
          ? navigation.getParam("user").description
          : "",
        userSavedPhoto: navigation.getParam("user").photo_path,
        region: {
          latitude: navigation.getParam("user").lattitude,
          longitude: navigation.getParam("user").longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421
        }
      });

      await this.getAllHobbies();

      //if user want to edit profile and have some kids, then we format that kids array and assign it to state
      if (navigation.getParam("user").kids.length > 0) {
        navigation.getParam("user").kids.map(async (kid: any, i: number) => {
          let kidObj = {
            name: kid.name,
            dateOfBirth: kid.date_of_birth,
            childGender: kid.child_gender
          };

          await this.setState(prevState => ({
            kids: [...prevState.kids, kidObj]
          }));
        });
      }
    }
  };

  removeKidFromState = (kidName: string): void => {
    console.log(["removeKidFromState", this.state.kids]);
    this.setState(prevState => ({
      kids: prevState.kids.filter((kid: any) => kid.name !== kidName)
    }));
  };

  cleanUserHobbies = (): void => {
    const navigation = this.props.navigation;

    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userId = navigation.getParam("user").id;

      axios
        .post(API_URL + "/api/cleanUserHobbies", {
          userId: userId
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(["cleanUserHobbies", response.data]);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  cleanUserKids = (): void => {
    const navigation = this.props.navigation;

    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userId = navigation.getParam("user").id;

      axios
        .post(API_URL + "/api/cleanUserKids", {
          userId: userId
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(["cleanUserKids", response.data]);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  setGender = (gender: string): void => {
    if (gender === "female") {
      this.setState({ actualKidGender: "female" });
    } else if (gender === "male") {
      this.setState({ actualKidGender: "male" });
    }
  };

  saveHobbies = (): void => {
    const navigation = this.props.navigation;
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      this.state.hobbies.map((hobby: { active: boolean; id: number }) => {
        if (hobby.active) {
          axios
            .post(API_URL + "/api/saveHobbyUser", {
              userEmail: userEmailName,
              hobby_id: hobby.id
            })
            .then(response => {
              if (response.data.status === "OK") {
                console.log(response);
              }
            })
            .catch(function(error) {
              console.log(error.message);
            });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  changeHobbyStatus = (hobbyKeyId: number): void => {
    let newHobbies = this.state.hobbies;

    //Find index of specific object using findIndex method.
    let hobbyUpdateElementIndex = newHobbies.findIndex(
      (obj: { keyId: number }) => obj.keyId == hobbyKeyId
    );

    newHobbies[hobbyUpdateElementIndex].active = !newHobbies[
      hobbyUpdateElementIndex
    ].active;

    this.setState({ hobbies: newHobbies });
  };

  onRegionChange = async (region: any) => {
    await this.setState({ region });
  };

  getAllHobbies = (): void => {
    const navigation = this.props.navigation;
    let API_URL = navigation.getParam("API_URL", "");
    let activeHobbies: { name: string }[] = [];
    //if user want to edit profile and have some hobbies, then we format that hobbies array and set active hobbies
    if (navigation.getParam("user").hobbies.length > 0) {
      navigation.getParam("user").hobbies.map(async (hobby: any, i: number) => {
        let activeHobbyObj = {
          name: hobby.name
        };
        activeHobbies.push(activeHobbyObj);
      });

      console.log(activeHobbies);
    }

    axios
      .get(API_URL + "/api/hobbiesList")
      .then(response => {
        if (response.data.status === "OK") {
          //loop through existing state list of all hobbies and check if name is element of activeHobbies
          response.data.result.map(
            (hobby: { name: string; id: number }, i: number) => {
              let hobbyObj = {};

              if (
                activeHobbies.filter(
                  activeHobby => activeHobby.name === hobby.name
                ).length > 0
              ) {
                hobbyObj = {
                  name: hobby.name,
                  id: hobby.id,
                  keyId: i,
                  active: true
                };
              } else {
                hobbyObj = {
                  name: hobby.name,
                  id: hobby.id,
                  keyId: i,
                  active: false
                };
              }

              this.setState(prevState => ({
                hobbies: [...prevState.hobbies, hobbyObj]
              }));

              //console.log(this.state);
            }
          );
        }
      })
      .catch(function(error) {
        console.log(error.message);
      });
  };

  setActualKidDate = (date: string): void => {
    this.setState({ actualKidDate: date });
  };

  setActualKidName = (name: string): void => {
    this.setState({ actualKidName: name });
  };

  addKid = async () => {
    if (this.state.actualKidName) {
      let kidObj = {
        name: this.state.actualKidName,
        dateOfBirth: this.state.actualKidDate,
        childGender: this.state.actualKidGender
      };

      await this.setState(prevState => ({
        kids: [...prevState.kids, kidObj]
      }));
      this.setState({
        actualKidName: "",
        actualKidDate: "2016-05-15",
        actualKidGender: "female"
      });
    }
  };

  handleChange = (name: string, value: string) => {
    // @ts-ignore
    this.setState((): void => ({ [name]: value }));
  };

  handleChoosePhoto = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: true,
      forceJpg: true,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: true,
      compressImageQuality: 1,
      compressVideoPreset: "MediumQuality",
      includeBase64: true
    })
      .then((image: any) => {
        console.log("received image", image);
        this.setState({ photo: image });
      })
      .catch((e: any) => {
        console.log(e);
      });
  };

  fileUpload = (): void => {
    const navigation = this.props.navigation;
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      axios
        .post(API_URL + "/api/uploadUserPhoto", {
          file: this.state.photo.path ? this.state.photo.path : "",
          fileName: userEmailName.split("@")[0],
          userEmail: userEmailName
        })
        .then(response => {
          console.log(["fileUpload", response]);
          if (response.data.status === "OK") {
            console.log(response);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  userLocationString = async () => {
    const { region } = this.state;

    let locationString;
    await Geocode.fromLatLng(region.latitude, region.longitude).then(
      (res: any) => {
        if (
          res.results[0].address_components[2] &&
          res.results[0].address_components[2].long_name &&
          res.results[0].address_components[3] &&
          res.results[0].address_components[3].long_name
        ) {
          let cityDistrict = res.results[0].address_components[2].long_name;
          let city = res.results[0].address_components[3].long_name;

          locationString = `${cityDistrict}, ${city}`;
          this.setState({ locationString: locationString });

          //console.log(addressObj);
        } else {
          locationString = `${res.results[0].formatted_address}`;
          console.log(["Geocode locactionString", locationString]);
          this.setState({ locationString: locationString });
        }
      },
      (error: any) => {
        console.error(error);
      }
    );
  };

  saveUserData = async () => {
    const navigation = this.props.navigation;
    const { age, desc, region, locationString } = this.state;

    //console.log(navigation.getParam("user"));
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      await axios
        .post(API_URL + "/api/updateUserInfo", {
          userEmail: userEmailName,
          age: age,
          desc: desc,
          lat: region.latitude,
          lng: region.longitude,
          locationString: locationString
        })
        .then(response => {
          if (response.data.status === "OK") {
            console.log(response);
          }
        })
        .catch(function(error) {
          console.log(error.message);
        });
    } catch (error) {
      console.log(error);
    }
  };

  saveUserKids = (): void => {
    const navigation = this.props.navigation;
    try {
      let API_URL = navigation.getParam("API_URL", "");
      let userEmailName = navigation.getParam("user").email;

      this.state.kids.map((kid: any) => {
        axios
          .post(API_URL + "/api/saveKid", {
            userEmail: userEmailName,
            name: kid.name,
            dateOfBirth: kid.dateOfBirth,
            childGender: kid.childGender
          })
          .then(response => {
            if (response.data.status === "OK") {
              console.log(response);
            }
          })
          .catch(function(error) {
            console.log(error.message);
          });
      });
    } catch (error) {
      console.log(error);
    }
  };

  nextStep = (): void => {
    this.setState({ actualStep: this.state.actualStep + 1 });
  };

  prevStep = (): void => {
    this.setState({ actualStep: this.state.actualStep - 1 });
  };

  submitData = async () => {
    this.setState({ loader: true });
    let navProps = this.props.navigation.state.params;

    //first remove user kids and hobbies and save new data
    await this.userLocationString();
    await this.cleanUserKids();
    await this.cleanUserHobbies();
    await this.saveUserData();
    await this.fileUpload();
    await this.saveUserKids();
    await this.saveHobbies();

    navProps.setUserFilledInfo();
    this.setState({ loader: false });
  };

  render() {
    const {
      age,
      desc,
      photo,
      region,
      kids,
      actualKidDate,
      actualKidName,
      hobbies,
      actualStep,
      actualKidGender,
      userSavedPhoto,
      loader
    } = this.state;
    return (
      <View>
        {loader ? (
          <View style={styles.loaderContainer}>
            <Image style={{ width: 100, height: 100 }} source={loaderImage} />
          </View>
        ) : (
          <View>
            {actualStep === 1 && (
              <Suspense fallback={<Text>Wczytywanie...</Text>}>
                <AgeDescScreen
                  handleChange={this.handleChange}
                  age={age}
                  desc={desc}
                  nextStep={this.nextStep}
                />
              </Suspense>
            )}
            {actualStep === 2 && (
              <Suspense fallback={<Text>Wczytywanie...</Text>}>
                <PhotoScreen
                  nextStep={this.nextStep}
                  prevStep={this.prevStep}
                  photo={photo}
                  handleChoosePhoto={this.handleChoosePhoto}
                  API_URL={this.props.navigation.getParam("API_URL", "")}
                  userSavedPhoto={userSavedPhoto}
                />
              </Suspense>
            )}
            {actualStep === 3 && (
              <Suspense fallback={<Text>Wczytywanie...</Text>}>
                <CoordsScreen
                  nextStep={this.nextStep}
                  prevStep={this.prevStep}
                  onRegionChange={this.onRegionChange}
                  region={region}
                />
              </Suspense>
            )}
            {actualStep === 4 && (
              <Suspense fallback={<Text>Wczytywanie...</Text>}>
                <ChooseKidsScreen
                  nextStep={this.nextStep}
                  prevStep={this.prevStep}
                  setActualKidName={this.setActualKidName}
                  addKid={this.addKid}
                  kids={kids}
                  actualKidDate={actualKidDate}
                  actualKidName={actualKidName}
                  setActualKidDate={this.setActualKidDate}
                  setGender={this.setGender}
                  actualKidGender={actualKidGender}
                  removeKidFromState={this.removeKidFromState}
                />
              </Suspense>
            )}
            {actualStep === 5 && (
              <Suspense fallback={<Text>Wczytywanie...</Text>}>
                <ChooseHobbiesScreen
                  prevStep={this.prevStep}
                  submitData={this.submitData}
                  hobbies={hobbies}
                  changeHobbyStatus={this.changeHobbyStatus}
                />
              </Suspense>
            )}
          </View>
        )}
      </View>
    );
  }
}

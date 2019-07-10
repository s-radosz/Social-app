import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableHighlight,
  SafeAreaView
} from "react-native";
import styles from "./style";
import AppIntroSlider from "react-native-app-intro-slider";

const support: any = require("./../../../assets/images/supportOrange.png");
const conversation: any = require("./../../../assets/images/ecoOrange.png");
const stroller: any = require("./../../../assets/images/strollerOrangeBig.png");
const makeUp: any = require("./../../../assets/images/makeUpOrange.png");
const emamyLogo: any = require("./../../../assets/images/emamyLogoTextVerticalSmall.png");

const Welcome = (props: any) => {
  const [slides, setSlides] = useState([
    {
      key: "slide1",
      text: "Bądź częścią lokalnej \nspołeczności mam",
      image: emamyLogo
    },
    {
      key: "slide3",
      text: "Twórz pozytywne relacje \nz innymi kobietami",
      image: conversation
    },
    {
      key: "slide2",
      text: "Wymieniaj się uwagami \nna wspólnym forum",
      image: support
    },
    {
      key: "slide4",
      text: "Kupuj oraz sprzedawaj \nprzedmioty",
      image: stroller
    },
    {
      key: "slide5",
      text: "Bądź sobą - bo taką\nCię lubimy!",
      image: makeUp
    }
  ]);

  const welcomeSliderRenderItem = (item: {
    key: string;
    image: any;
    text: string;
  }) => {
    return (
      <View style={styles.welcomeSlide}>
        <Image
          style={{ width: 150 }}
          resizeMode="contain"
          source={item.image}
        />
        <Text style={styles.welcomeSlideText}>{item.text}</Text>
      </View>
    );
  };

  const navigation = props.navigation;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#fff"
      }}
    >
      <View style={styles.container}>
        <AppIntroSlider
          renderItem={welcomeSliderRenderItem}
          slides={slides}
          activeDotStyle={styles.activeWelcomeSlideRect}
          dotStyle={styles.inActiveWelcomeSlideRect}
          paginationStyle={styles.welcomeSliderPagination}
        />

        <View>
          <TouchableHighlight
            style={styles.loginBtn}
            onPress={(): void => navigation.navigate("Login")}
            underlayColor={"#dd904d"}
          >
            <Text style={styles.peachBtnText}>Logowanie</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.registerBtn}
            onPress={() => navigation.navigate("Register")}
            underlayColor={"#fff"}
          >
            <Text style={styles.subBtn}>Rejestracja</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default Welcome;

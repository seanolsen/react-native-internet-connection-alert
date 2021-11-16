import React, { createRef } from "react";
import { Text, View } from "react-native";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import DropdownAlert from "react-native-dropdownalert";
/**
 * ? Local Imports
 */
import styles from "./InternetConnectionAlert.style";

type DropdownAlertType = "info" | "warn" | "error" | "custom" | "success";

interface IProps {
  type: DropdownAlertType;
  title: string;
  message: string;
  payload?: object;
  interval?: number;
  onChange: (state: NetInfoState) => void;
}

interface IState {}

export default class InternetConnectionAlert extends React.Component<
  IProps,
  IState
> {
  dropDownAlertRef: any;
  
  constructor(props) {
    super(props);
    this.dropDownAlertRef = createRef();
  }

  componentDidMount() {
    this.listenIsInternetAvailable();
  }

  listenIsInternetAvailable = () => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const { isConnected } = state;
      this.props.onChange && this.props.onChange(state);
      this.showAlert(isConnected);
    });
    return () => {
      unsubscribe();
    };
  };

  showAlert = (isConnected: boolean) => {
    if (!isConnected) {
      const {
        type = "error",
        title = "Internet Connection Problem",
        message = "Please check your network connection",
        payload,
        interval,
      } = this.props;
      this.dropDownAlertRef.alertWithType(
        type,
        title,
        message,
        payload,
        interval,
      );
    } else {
      this.dropDownAlertRef.closeAction();
    }
  };

  renderAlert = () => {
    return (
      <DropdownAlert
        ref={this.dropDownAlertRef}
        tapToCloseEnabled={false}
        panResponderEnabled={false}
        closeInterval={0} // ? Cancel auto close
        {...this.props}
      />
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.props.children}
        {this.renderAlert()}
      </View>
    );
  }
}

import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  View,
  ScrollView,
  Dimensions,
  Text,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from "react-native";
import tinycolor from "tinycolor2";

import PageData from "./components/PageData";
import Paginator from "./components/Paginator";

const getDefaultStyle = isLight => ({
  color: isLight ? "rgba(0, 0, 0, 0.8)" : "#fff",
});

export default class Onboarding extends Component {
  constructor() {
    super();

    this.state = {
      currentPage: 0,
      neverDisplay: true,
    };
  }

  updatePosition = event => {
    const { contentOffset, layoutMeasurement } = event.nativeEvent;
    const pageFraction = contentOffset.x / layoutMeasurement.width;
    const page = Math.round(pageFraction);
    const isLastPage = this.props.pages.length === page + 1;
    if (isLastPage && pageFraction - page > 0.3) {
      this.props.onEnd();
    } else {
      this.setState({ currentPage: page });
    }
  };

  goNext = () => {
    const { width } = Dimensions.get("window");
    const { currentPage } = this.state;
    const nextPage = currentPage + 1;
    const offsetX = nextPage * width;
    this.refs.scroll.scrollTo(
      {
        x: offsetX,
        animated: true,
      },
      () => {
        this.setState({ currentPage: nextPage });
      }
    );
  };

  _toggleNeverDisplay = () => {
    this.setState({ neverDisplay: !this.state.neverDisplay });
  };

  render() {
    const { width, height } = Dimensions.get("window");
    const {
      pages,
      bottomOverlay,
      showSkip,
      showNext,
      showDone,
      containerStyle,
      skipLabel,
      displayNeverDisplay,
      NeverDisplayComponent,
      neverDisplayLabel,
    } = this.props;
    const currentPage = pages[this.state.currentPage] || pages[0];
    const { backgroundColor } = currentPage;
    const isLight = tinycolor(backgroundColor).getBrightness() > 180;

    return (
      <View
        style={[
          {
            flex: 1,
            backgroundColor: backgroundColor,
            justifyContent: "center",
          },
          containerStyle,
        ]}
      >
        <ScrollView
          ref="scroll"
          pagingEnabled={true}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onScroll={this.updatePosition}
          scrollEventThrottle={100}
        >
          {pages.map(
            ({ image, title, subtitle, titleStyles, subtitleStyles }, idx) => (
              <PageData
                key={idx}
                isLight={isLight}
                image={image}
                title={title}
                subtitle={subtitle}
                titleStyles={titleStyles}
                subtitleStyles={subtitleStyles}
                width={width}
                height={height - 100}
              />
            )
          )}
        </ScrollView>
        {displayNeverDisplay &&
          this.state.currentPage === pages.length - 1 && (
            <View style={styles.toggleContainer}>
              {NeverDisplayComponent ? (
                NeverDisplayComponent
              ) : (
                <View style={styles.toggleContainer}>
                  <Text style={getDefaultStyle(isLight)}>
                    {neverDisplayLabel || "Never display"}
                  </Text>
                  <Switch
                    style={{ margin: 0 }}
                    value={this.state.neverDisplay}
                    onValueChange={this._toggleNeverDisplay}
                  />
                </View>
              )}
            </View>
          )}
        <Paginator
          isLight={isLight}
          overlay={bottomOverlay}
          showSkip={showSkip}
          showNext={showNext}
          showDone={showDone}
          pages={pages.length}
          currentPage={this.state.currentPage}
          onEnd={this.props.onEnd}
          onNext={this.goNext}
          skipLabel={skipLabel}
        />
      </View>
    );
  }
}

Onboarding.propTypes = {
  pages: PropTypes.arrayOf(
    PropTypes.shape({
      backgroundColor: PropTypes.string.isRequired,
      image: PropTypes.element.isRequired,
      title: PropTypes.string.isRequired,
      subtitle: PropTypes.string.isRequired,
    })
  ).isRequired,
  bottomOverlay: PropTypes.bool,
  showSkip: PropTypes.bool,
  showNext: PropTypes.bool,
  showDone: PropTypes.bool,
  displayNeverDisplay: PropTypes.bool,
  skipLabel: PropTypes.string,
  neverDisplayLabel: PropTypes.string,
  NeverDisplayComponent: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.func,
  ]),
};

Onboarding.defaultProps = {
  bottomOverlay: true,
  showSkip: true,
  showNext: true,
  showDone: true,
  displayNeverDisplay: true,
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "center",
    margin: 10,
    width: "95%",
  },
});

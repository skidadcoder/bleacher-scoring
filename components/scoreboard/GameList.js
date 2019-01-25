import _ from "lodash";
import moment from "moment";
import React from "react";
import { StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { Icon } from "expo";
import { human, iOSColors } from "react-native-typography";
import { SwipeListView } from "react-native-swipe-list-view";
import Colors from "../../constants/Colors";
import timeHelpers from "../../timeHelpers";

const initialState = {};

export default class GameList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  };

  onEditRow = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);

    if (this.props.onGameEditPress) {
      this.props.onGameEditPress(item);
    }
  };

  onDeleteRow = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);

    if (this.props.onGameDeletePress) {
      this.props.onGameDeletePress(item);
    }
  };

  onFavoritePress = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);
    this.props.onGameFavoritePress(item);
  };

  onUnfavoritePress = (rowMap, item) => e => {
    this.closeRow(rowMap, item.gameUid);
    this.props.onGameUnfavoritePress(item);
  };

  onRowDidOpen = (rowKey, rowMap) => {
    setTimeout(() => {
      this.closeRow(rowMap, rowKey);
    }, 2000);
  };

  getScore = game => {
    const currentSet = game.currentSet === "Final" ? 6 : game.currentSet;
    const score = { homeTeamScore: 0, awayTeamScore: 0 };

    game.sets.map(function(set, i) {
      if (i < currentSet) {
        if (set.awayTeamScore > set.homeTeamScore) {
          score.awayTeamScore++;
        } else if (set.awayTeamScore < set.homeTeamScore) {
          score.homeTeamScore++;
        }
      }
    });

    return score;
  };

  isSavedGame = item => {
    const { savedGames } = this.props;

    var foundGame = _.find(savedGames, function(o) {
      return o.gameUid === item.gameUid;
    });

    if (foundGame) {
      return true;
    }

    return false;
  };

  isWinner = (home, game) => {
    if (game.currentSet === "Final") {
      const score = this.getScore(game);

      if (home) {
        return score.homeTeamScore > score.awayTeamScore;
      } else {
        return score.homeTeamScore < score.awayTeamScore;
      }
    }

    return false;
  };

  renderFavoriteButton = (rowMap, item) => {
    const { onGameFavoritePress, onGameUnfavoritePress } = this.props;

    const isSavedGame = this.isSavedGame(item);

    if (onGameFavoritePress && onGameUnfavoritePress) {
      return (
        <TouchableOpacity
          style={[styles.backRightBtn]}
          onPress={isSavedGame ? this.onUnfavoritePress(rowMap, item) : this.onFavoritePress(rowMap, item)}
        >
          <Icon.MaterialCommunityIcons
            name={isSavedGame ? "heart-off" : "heart-outline"}
            size={26}
            color={iOSColors.white}
            style={{ paddingRight: 5 }}
          />
        </TouchableOpacity>
      );
    }
  };

  renderEditGameButton = (rowMap, item) => {
    const { onGameEditPress } = this.props;

    if (onGameEditPress) {
      return (
        <TouchableOpacity style={[styles.backRightBtn]} onPress={this.onEditRow(rowMap, item)}>
          <Icon.MaterialIcons name="edit" size={26} color={iOSColors.white} style={{ paddingRight: 5 }} />
        </TouchableOpacity>
      );
    }
  };

  renderDeleteGameButton = (rowMap, item) => {
    const { onGameDeletePress } = this.props;

    if (onGameDeletePress) {
      return (
        <TouchableOpacity style={[styles.backRightBtn]} onPress={this.onDeleteRow(rowMap, item)}>
          <Icon.MaterialIcons name="delete" size={26} color={iOSColors.white} style={{ paddingRight: 5 }} />
        </TouchableOpacity>
      );
    }
  };

  renderGameItem = game => {
    const { onGamePress } = this.props;

    return (
      <TouchableHighlight onPress={onGamePress(game)} style={styles.rowFront} underlayColor={iOSColors.lightGray2}>
        <View>
          <View style={{ flexDirection: "row", alignItems: "top", justifyContent: "space-between" }}>
            <View style={{ flex: 3, borderRightColor: iOSColors.lightGray, borderRightWidth: 1 }}>
              <View style={{ flex: 1, flexDirection: "row", marginRight: 5 }}>
                <View style={{ flex: 1 }}>
                  <Text numberOfLines={1} style={this.isWinner(false, game) ? styles.winner : styles.loser}>
                    {game.awayTeamName}
                  </Text>
                  <Text numberOfLines={1} style={this.isWinner(true, game) ? styles.winner : styles.loser}>
                    {game.homeTeamName}
                  </Text>
                </View>

                {game.sets.map((set, i) => {
                  if (
                    i <= game.currentSet ||
                    (game.currentSet === "Final" && (set.homeTeamScore > 0 || set.awayTeamScore > 0))
                  ) {
                    return (
                      <View key={i} style={{ marginRight: 5 }}>
                        <Text
                          style={[this.isWinner(false, game) ? styles.winner : styles.loser, { textAlign: "center" }]}
                        >
                          {set.awayTeamScore}
                        </Text>
                        <Text
                          style={[this.isWinner(true, game) ? styles.winner : styles.loser, { textAlign: "center" }]}
                        >
                          {set.homeTeamScore}
                        </Text>
                      </View>
                    );
                  }
                })}
              </View>
              <Text numberOfLines={1} style={[human.footnote, { color: iOSColors.gray, marginTop: 3 }]}>
                {`${game.venueName}, ${game.address || "Unknown address"}`}
              </Text>              
            </View>
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <View style={{ backgroundColor: Colors.primaryLightColor, borderRadius: 5, padding: 3 }}>
                <Text numberOfLines={1} style={[human.footnoteWhite, { textAlign: "center" }]}>
                  {game.currentSet === "Final" ? "Final" : "Set " + game.currentSet}
                </Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text numberOfLines={1} style={[human.footnote, { color: iOSColors.gray, marginLeft: 2 }]}>
                  {timeHelpers.timeAgo(game.lastUpdate)}
                </Text>
              </View>
              <View style={{ marginTop: 4 }}>
                <Text numberOfLines={1} style={[human.footnote, { color: iOSColors.gray, marginLeft: 2 }]}>
                  {game.displayName}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  render() {
    const { data, onGameEditPress, onGameDeletePress, onGameFavoritePress, onGameUnfavoritePress } = this.props;

    let rightOpenValue = -10;
    const defaultWidth = 60;

    rightOpenValue -= onGameEditPress ? defaultWidth : 0;
    rightOpenValue -= onGameDeletePress ? defaultWidth : 0;
    rightOpenValue -= onGameFavoritePress && onGameUnfavoritePress ? defaultWidth : 0;

    return (
      <SwipeListView
        useFlatList
        disableRightSwipe
        data={data}
        keyExtractor={item => item.gameUid}
        renderItem={(data, rowMap) => {
          return this.renderGameItem(data.item);
        }}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            {this.renderFavoriteButton(rowMap, data.item)}
            {this.renderEditGameButton(rowMap, data.item)}
            {this.renderDeleteGameButton(rowMap, data.item)}
          </View>
        )}
        leftOpenValue={75}
        rightOpenValue={rightOpenValue}
        previewRowKey={"0"}
        previewOpenValue={-40}
        previewOpenDelay={3000}
        onRowDidOpen={this.onRowDidOpen}
      />
    );
  }
}

const styles = StyleSheet.create({
  backTextWhite: {
    color: iOSColors.white
  },
  rowFront: {
    backgroundColor: iOSColors.white,
    borderBottomColor: iOSColors.lightGray2,
    borderBottomWidth: 1,
    padding: 10
  },
  rowBack: {
    alignItems: "center",
    backgroundColor: iOSColors.gray,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  backRightBtn: {
    alignItems: "center",
    justifyContent: "center",
    width: 60
  },
  winner: {
    ...human.headlineObject,
    color: Colors.secondaryColor
  },
  loser: {
    ...human.bodyObject
  }
});

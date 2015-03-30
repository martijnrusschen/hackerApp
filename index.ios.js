'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  StyleSheet,
  Text,
  View,
} = React;

var REQUEST_URL = 'https://hackerone.com/programs/search.json?query=&page=1';

var hackerApp = React.createClass({
  getInitialState: function() {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      loaded: false,
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {
    fetch(REQUEST_URL)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData.results),
          loaded: true,
        });
      })
      .done();
  },

  renderLoadingView: function() {
    return (
      <View style={styles.container}>
        <Text>
          Loading programs...
        </Text>
      </View>
    );
  },

  renderProgramMeta: function(program) {
    return (
      <Text style={styles.meta}>
        Bug count: {program.meta.bug_count} |
        Minimum bounty: {program.meta.minimum_bounty}
      </Text>
    );
  },

  renderProgram: function(program) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: program.profile_picture}}
          style={styles.thumbnail} />
        <View style={styles.rightContainer}>
          <Text style={styles.title}>{program.name}</Text>
          {this.renderProgramMeta(program)}
        </View>
      </View>
    );
  },

  render: function() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderProgram}
        style={styles.listView}
      />
    );
  },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  rightContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  meta: {
    fontSize: 15,
    textAlign: 'center',
  },
  thumbnail: {
    width: 80,
    height: 80,
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
});

AppRegistry.registerComponent('hackerApp', () => hackerApp);

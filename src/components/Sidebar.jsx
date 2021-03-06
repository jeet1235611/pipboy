import React from 'react';
import { Link } from 'react-router';

import { withStore } from 'fluorine-lib';

import {
  decoding,
} from 'pipboylib';

const { generateTreeFromDatabase } = decoding;

import Database from '../stores/Database';
import dispatcher from '../dispatcher';

const remote = require('remote');
const BrowserWindow = remote.require('browser-window');
const win = BrowserWindow.getFocusedWindow();

@withStore(dispatcher
  .reduce(Database)
  .map(x => generateTreeFromDatabase(x))
  .filter(x => x && x.Status)
  .map(x => x.Status.EffectColor)
  .map(x => {
    const color = x.map(v => Math.round(v * 255));
    return `rgb(${color[0]},${color[1]},${color[2]})`;
  })
  .distinctUntilChanged(),
  'color')
export default class Sidebar extends React.Component {
  static displayName = 'Sidebar';

  static propTypes = {
    basepath: React.PropTypes.string,
    color: React.PropTypes.string,
  };

  handleFullscreen() {
    win.setFullScreen(!(win.isFullScreen()));
  }
  render() {
    const styles = {
      container: {
        height: '100%',
        width: 200,
        padding: 10,
        color: this.props.color,
        WebkitAppRegion: 'drag',
      },
      sidebar: {
        borderRight: `3px solid ${this.props.color}`,
        paddingRight: 10,
        height: '100%',
        width: '100%',
      },
      li: {
        width: '100%',
        marginBottom: 5,
        textTransform: 'uppercase',
        WebkitAppRegion: 'no-drag',
      },
      item: {
        base: {
          width: '100%',
          padding: 5,
          background: 'none',
          color: this.props.color,
        },
        active: {
          background: this.props.color,
          color: '#000',
        },
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.sidebar}>
          <ul>
            <li style={styles.li}>
              <Link
                to={`${this.props.basepath}/map`}
                activeStyle={styles.item.active}
                style={styles.item.base}>
                Map
              </Link>
            </li>

            <li style={styles.li}>
              <Link
                to={`${this.props.basepath}/about`}
                activeStyle={styles.item.active}
                style={styles.item.base}>
                About
              </Link>
            </li>

            <li style={styles.li}>
              <span
                onClick={this.handleFullscreen}
                activeStyle={styles.item.active}
                style={styles.item.base}>
                Fullscreen
              </span>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import Hls from 'hls.js';

class ReactHls extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            playerId : Date.now()
        };

        this.hls = null;
    }

    componentDidUpdate () {
        this._initPlayer();
    }

    componentDidMount () {
        this._initPlayer();
    }

    componentWillUnmount () {
        let { hls } = this;

        if (hls) {
            hls.destroy();
        }
    }

    _initPlayer () {
        if (this.hls) {
            this.hls.destroy();
        }

        let { url, autoplay, hlsConfig } = this.props;
        let { video : $video } = this.refs;
        let hls = new Hls(hlsConfig);

        hls.loadSource(url);
        hls.attachMedia($video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            if (autoplay) {
                $video.play();
            }
        });
        hls.on(Hls.Events.ERROR, (e, data) => {
            this.props.onError && this.props.onError(e, data)
        }) 

        this.hls = hls;
    }

    render () {
        let { playerId } = this.state;
        const { controls, width, height, poster, videoProps } = this.props;

        return (
            <div key={playerId} className="player-area">
                <video ref="video"
                       className="hls-player"
                       id={`react-hls-${playerId}`}
                       controls={controls}
                       crossOrigin={'anonymous'}
                       width={width}
                       height={height}
                       poster={poster}
                       {...videoProps}></video>
            </div>
        )
    }
}

ReactHls.propTypes = {
    url : PropTypes.string.isRequired,
    autoplay : PropTypes.bool,
    hlsConfig : PropTypes.object, //https://github.com/dailymotion/hls.js/blob/master/API.md#fine-tuning
    controls : PropTypes.bool,
    width : PropTypes.number,
    height : PropTypes.number,
    poster : PropTypes.string,
    videoProps : PropTypes.object,
    onError: PropTypes.func,
}

ReactHls.defaultProps = {
    autoplay : true,
    hlsConfig : {},
    controls : true,
    width : 500,
    height : 375,
    onError: null
}

export default ReactHls;

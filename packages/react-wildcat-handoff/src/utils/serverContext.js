"use strict";

const React = require("react");
const Router = require("react-router");
const RouterContext = Router.RouterContext;

const radium = require("radium");
const prefixAll = require("radium-plugin-prefix-all");
const matchMediaMock = require("match-media-mock").create();
const getClientSize = require("./getClientSize.js");

module.exports = function serverContext(request, cookies, renderProps) {
    const clientSize = getClientSize(cookies, request.query);
    const userAgent = request.header["user-agent"];

    const plugins = [
        radium.Plugins.mergeStyleArray,
        radium.Plugins.checkProps,
        radium.Plugins.resolveMediaQueries,
        radium.Plugins.resolveInteractionStyles,
        radium.Plugins.prefix,
        prefixAll,
        radium.Plugins.checkProps
    ];

    matchMediaMock.setConfig({
        type: "screen",
        height: clientSize.height,
        width: clientSize.width
    });

    /* eslint-disable react/no-multi-comp */
    const ServerContext = React.createClass({
        childContextTypes: {
            radiumConfig: React.PropTypes.shape({
                plugins: React.PropTypes.array,
                matchMedia: React.PropTypes.obj,
                userAgent: React.PropTypes.string
            })
        },

        getChildContext() {
            // Pass user agent to Radium
            return {
                radiumConfig: {
                    plugins,
                    matchMedia: matchMediaMock,
                    userAgent
                }
            };
        },

        render() {
            return React.createElement(RouterContext, Object.assign({}, this.props, renderProps));
        }
    });

    return React.createElement(ServerContext);
};

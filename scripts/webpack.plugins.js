const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");


module.exports = {
    

    copyWebpackPlugin: function(...args) {
        return new CopyWebpackPlugin(...args);
    },

    htmlWebpackPlugin: function(...args) {
        return new HtmlWebpackPlugin(...args);
    },

    cleanWebpackPlugin: function(...args) {
        return new CleanWebpackPlugin(...args);
    }
};

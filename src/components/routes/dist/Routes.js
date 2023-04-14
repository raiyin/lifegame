"use strict";
exports.__esModule = true;
exports.Routes = void 0;
var react_router_dom_1 = require("react-router-dom");
var Live_1 = require("../../pages/Live");
var Home_1 = require("../../pages/Home");
var router = react_router_dom_1.createBrowserRouter([
    {
        path: '/products',
        element: React.createElement(Live_1["default"], null)
    },
    {
        path: '/',
        element: React.createElement(Home_1["default"], null)
    },
]);
function Routes() {
    return React.createElement(react_router_dom_1.RouterProvider, { router: router });
}
exports.Routes = Routes;

"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/admin/projects/[id]/route";
exports.ids = ["app/api/admin/projects/[id]/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "better-sqlite3":
/*!*********************************!*\
  !*** external "better-sqlite3" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("better-sqlite3");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _Users_juanfelipe_cadavidrojas_Documents_Personal_AI_experiments_jfcr_portfolio_app_api_admin_projects_id_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/admin/projects/[id]/route.ts */ \"(rsc)/./app/api/admin/projects/[id]/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/admin/projects/[id]/route\",\n        pathname: \"/api/admin/projects/[id]\",\n        filename: \"route\",\n        bundlePath: \"app/api/admin/projects/[id]/route\"\n    },\n    resolvedPagePath: \"/Users/juanfelipe.cadavidrojas/Documents/Personal/AI experiments/jfcr-portfolio/app/api/admin/projects/[id]/route.ts\",\n    nextConfigOutput,\n    userland: _Users_juanfelipe_cadavidrojas_Documents_Personal_AI_experiments_jfcr_portfolio_app_api_admin_projects_id_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/admin/projects/[id]/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhZG1pbiUyRnByb2plY3RzJTJGJTVCaWQlNUQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmFkbWluJTJGcHJvamVjdHMlMkYlNUJpZCU1RCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmFkbWluJTJGcHJvamVjdHMlMkYlNUJpZCU1RCUyRnJvdXRlLnRzJmFwcERpcj0lMkZVc2VycyUyRmp1YW5mZWxpcGUuY2FkYXZpZHJvamFzJTJGRG9jdW1lbnRzJTJGUGVyc29uYWwlMkZBSSUyMGV4cGVyaW1lbnRzJTJGamZjci1wb3J0Zm9saW8lMkZhcHAmcGFnZUV4dGVuc2lvbnM9dHN4JnBhZ2VFeHRlbnNpb25zPXRzJnBhZ2VFeHRlbnNpb25zPWpzeCZwYWdlRXh0ZW5zaW9ucz1qcyZyb290RGlyPSUyRlVzZXJzJTJGanVhbmZlbGlwZS5jYWRhdmlkcm9qYXMlMkZEb2N1bWVudHMlMkZQZXJzb25hbCUyRkFJJTIwZXhwZXJpbWVudHMlMkZqZmNyLXBvcnRmb2xpbyZpc0Rldj10cnVlJnRzY29uZmlnUGF0aD10c2NvbmZpZy5qc29uJmJhc2VQYXRoPSZhc3NldFByZWZpeD0mbmV4dENvbmZpZ091dHB1dD0mcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDb0U7QUFDako7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qZmNyLXBvcnRmb2xpby8/MGVkNyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcHBSb3V0ZVJvdXRlTW9kdWxlIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvZnV0dXJlL3JvdXRlLWtpbmRcIjtcbmltcG9ydCB7IHBhdGNoRmV0Y2ggYXMgX3BhdGNoRmV0Y2ggfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9saWIvcGF0Y2gtZmV0Y2hcIjtcbmltcG9ydCAqIGFzIHVzZXJsYW5kIGZyb20gXCIvVXNlcnMvanVhbmZlbGlwZS5jYWRhdmlkcm9qYXMvRG9jdW1lbnRzL1BlcnNvbmFsL0FJIGV4cGVyaW1lbnRzL2pmY3ItcG9ydGZvbGlvL2FwcC9hcGkvYWRtaW4vcHJvamVjdHMvW2lkXS9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYWRtaW4vcHJvamVjdHMvW2lkXS9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2FkbWluL3Byb2plY3RzL1tpZF1cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FkbWluL3Byb2plY3RzL1tpZF0vcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCIvVXNlcnMvanVhbmZlbGlwZS5jYWRhdmlkcm9qYXMvRG9jdW1lbnRzL1BlcnNvbmFsL0FJIGV4cGVyaW1lbnRzL2pmY3ItcG9ydGZvbGlvL2FwcC9hcGkvYWRtaW4vcHJvamVjdHMvW2lkXS9yb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYWRtaW4vcHJvamVjdHMvW2lkXS9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/admin/projects/[id]/route.ts":
/*!**********************************************!*\
  !*** ./app/api/admin/projects/[id]/route.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   DELETE: () => (/* binding */ DELETE),\n/* harmony export */   PUT: () => (/* binding */ PUT)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _lib_prisma__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @/lib/prisma */ \"(rsc)/./lib/prisma.ts\");\n/* harmony import */ var _lib_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/auth */ \"(rsc)/./lib/auth.ts\");\n\n\n\nasync function PUT(request, { params }) {\n    if (!await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.isAuthenticated)()) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    const { id } = await params;\n    const data = await request.json();\n    try {\n        const project = await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.project.update({\n            where: {\n                id: parseInt(id)\n            },\n            data: {\n                title: data.title,\n                subtitle: data.subtitle,\n                tags: data.tags,\n                description: data.description,\n                ctaLabel: data.ctaLabel,\n                ctaHref: data.ctaHref,\n                thumbnailUrl: data.thumbnailUrl || null,\n                cardColor: data.cardColor,\n                size: data.size,\n                showThumbnailOnMobile: data.showThumbnailOnMobile,\n                order: data.order\n            }\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(project);\n    } catch  {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"DB error\"\n        }, {\n            status: 400\n        });\n    }\n}\nasync function DELETE(_request, { params }) {\n    if (!await (0,_lib_auth__WEBPACK_IMPORTED_MODULE_2__.isAuthenticated)()) {\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Unauthorized\"\n        }, {\n            status: 401\n        });\n    }\n    const { id } = await params;\n    await _lib_prisma__WEBPACK_IMPORTED_MODULE_1__.prisma.project.delete({\n        where: {\n            id: parseInt(id)\n        }\n    });\n    return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n        success: true\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FkbWluL3Byb2plY3RzL1tpZF0vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBd0Q7QUFDbEI7QUFDTztBQU10QyxlQUFlRyxJQUFJQyxPQUFvQixFQUFFLEVBQUVDLE1BQU0sRUFBVTtJQUNoRSxJQUFJLENBQUUsTUFBTUgsMERBQWVBLElBQUs7UUFDOUIsT0FBT0YscURBQVlBLENBQUNNLElBQUksQ0FBQztZQUFFQyxPQUFPO1FBQWUsR0FBRztZQUFFQyxRQUFRO1FBQUk7SUFDcEU7SUFFQSxNQUFNLEVBQUVDLEVBQUUsRUFBRSxHQUFHLE1BQU1KO0lBQ3JCLE1BQU1LLE9BQU8sTUFBTU4sUUFBUUUsSUFBSTtJQUUvQixJQUFJO1FBQ0YsTUFBTUssVUFBVSxNQUFNViwrQ0FBTUEsQ0FBQ1UsT0FBTyxDQUFDQyxNQUFNLENBQUM7WUFDMUNDLE9BQU87Z0JBQUVKLElBQUlLLFNBQVNMO1lBQUk7WUFDMUJDLE1BQU07Z0JBQ0pLLE9BQU9MLEtBQUtLLEtBQUs7Z0JBQ2pCQyxVQUFVTixLQUFLTSxRQUFRO2dCQUN2QkMsTUFBTVAsS0FBS08sSUFBSTtnQkFDZkMsYUFBYVIsS0FBS1EsV0FBVztnQkFDN0JDLFVBQVVULEtBQUtTLFFBQVE7Z0JBQ3ZCQyxTQUFTVixLQUFLVSxPQUFPO2dCQUNyQkMsY0FBY1gsS0FBS1csWUFBWSxJQUFJO2dCQUNuQ0MsV0FBV1osS0FBS1ksU0FBUztnQkFDekJDLE1BQU1iLEtBQUthLElBQUk7Z0JBQ2ZDLHVCQUF1QmQsS0FBS2MscUJBQXFCO2dCQUNqREMsT0FBT2YsS0FBS2UsS0FBSztZQUNuQjtRQUNGO1FBQ0EsT0FBT3pCLHFEQUFZQSxDQUFDTSxJQUFJLENBQUNLO0lBQzNCLEVBQUUsT0FBTTtRQUNOLE9BQU9YLHFEQUFZQSxDQUFDTSxJQUFJLENBQUM7WUFBRUMsT0FBTztRQUFXLEdBQUc7WUFBRUMsUUFBUTtRQUFJO0lBQ2hFO0FBQ0Y7QUFFTyxlQUFla0IsT0FBT0MsUUFBcUIsRUFBRSxFQUFFdEIsTUFBTSxFQUFVO0lBQ3BFLElBQUksQ0FBRSxNQUFNSCwwREFBZUEsSUFBSztRQUM5QixPQUFPRixxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1lBQUVDLE9BQU87UUFBZSxHQUFHO1lBQUVDLFFBQVE7UUFBSTtJQUNwRTtJQUVBLE1BQU0sRUFBRUMsRUFBRSxFQUFFLEdBQUcsTUFBTUo7SUFDckIsTUFBTUosK0NBQU1BLENBQUNVLE9BQU8sQ0FBQ2lCLE1BQU0sQ0FBQztRQUFFZixPQUFPO1lBQUVKLElBQUlLLFNBQVNMO1FBQUk7SUFBRTtJQUMxRCxPQUFPVCxxREFBWUEsQ0FBQ00sSUFBSSxDQUFDO1FBQUV1QixTQUFTO0lBQUs7QUFDM0MiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9qZmNyLXBvcnRmb2xpby8uL2FwcC9hcGkvYWRtaW4vcHJvamVjdHMvW2lkXS9yb3V0ZS50cz9kYzI3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5leHRSZXF1ZXN0LCBOZXh0UmVzcG9uc2UgfSBmcm9tIFwibmV4dC9zZXJ2ZXJcIjtcbmltcG9ydCB7IHByaXNtYSB9IGZyb20gXCJAL2xpYi9wcmlzbWFcIjtcbmltcG9ydCB7IGlzQXV0aGVudGljYXRlZCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5cbmludGVyZmFjZSBQYXJhbXMge1xuICBwYXJhbXM6IFByb21pc2U8eyBpZDogc3RyaW5nIH0+O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUFVUKHJlcXVlc3Q6IE5leHRSZXF1ZXN0LCB7IHBhcmFtcyB9OiBQYXJhbXMpIHtcbiAgaWYgKCEoYXdhaXQgaXNBdXRoZW50aWNhdGVkKCkpKSB7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgZXJyb3I6IFwiVW5hdXRob3JpemVkXCIgfSwgeyBzdGF0dXM6IDQwMSB9KTtcbiAgfVxuXG4gIGNvbnN0IHsgaWQgfSA9IGF3YWl0IHBhcmFtcztcbiAgY29uc3QgZGF0YSA9IGF3YWl0IHJlcXVlc3QuanNvbigpO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgcHJvamVjdCA9IGF3YWl0IHByaXNtYS5wcm9qZWN0LnVwZGF0ZSh7XG4gICAgICB3aGVyZTogeyBpZDogcGFyc2VJbnQoaWQpIH0sXG4gICAgICBkYXRhOiB7XG4gICAgICAgIHRpdGxlOiBkYXRhLnRpdGxlLFxuICAgICAgICBzdWJ0aXRsZTogZGF0YS5zdWJ0aXRsZSxcbiAgICAgICAgdGFnczogZGF0YS50YWdzLFxuICAgICAgICBkZXNjcmlwdGlvbjogZGF0YS5kZXNjcmlwdGlvbixcbiAgICAgICAgY3RhTGFiZWw6IGRhdGEuY3RhTGFiZWwsXG4gICAgICAgIGN0YUhyZWY6IGRhdGEuY3RhSHJlZixcbiAgICAgICAgdGh1bWJuYWlsVXJsOiBkYXRhLnRodW1ibmFpbFVybCB8fCBudWxsLFxuICAgICAgICBjYXJkQ29sb3I6IGRhdGEuY2FyZENvbG9yLFxuICAgICAgICBzaXplOiBkYXRhLnNpemUsXG4gICAgICAgIHNob3dUaHVtYm5haWxPbk1vYmlsZTogZGF0YS5zaG93VGh1bWJuYWlsT25Nb2JpbGUsXG4gICAgICAgIG9yZGVyOiBkYXRhLm9yZGVyLFxuICAgICAgfSxcbiAgICB9KTtcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24ocHJvamVjdCk7XG4gIH0gY2F0Y2gge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIkRCIGVycm9yXCIgfSwgeyBzdGF0dXM6IDQwMCB9KTtcbiAgfVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gREVMRVRFKF9yZXF1ZXN0OiBOZXh0UmVxdWVzdCwgeyBwYXJhbXMgfTogUGFyYW1zKSB7XG4gIGlmICghKGF3YWl0IGlzQXV0aGVudGljYXRlZCgpKSkge1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiBcIlVuYXV0aG9yaXplZFwiIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gIH1cblxuICBjb25zdCB7IGlkIH0gPSBhd2FpdCBwYXJhbXM7XG4gIGF3YWl0IHByaXNtYS5wcm9qZWN0LmRlbGV0ZSh7IHdoZXJlOiB7IGlkOiBwYXJzZUludChpZCkgfSB9KTtcbiAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgc3VjY2VzczogdHJ1ZSB9KTtcbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJwcmlzbWEiLCJpc0F1dGhlbnRpY2F0ZWQiLCJQVVQiLCJyZXF1ZXN0IiwicGFyYW1zIiwianNvbiIsImVycm9yIiwic3RhdHVzIiwiaWQiLCJkYXRhIiwicHJvamVjdCIsInVwZGF0ZSIsIndoZXJlIiwicGFyc2VJbnQiLCJ0aXRsZSIsInN1YnRpdGxlIiwidGFncyIsImRlc2NyaXB0aW9uIiwiY3RhTGFiZWwiLCJjdGFIcmVmIiwidGh1bWJuYWlsVXJsIiwiY2FyZENvbG9yIiwic2l6ZSIsInNob3dUaHVtYm5haWxPbk1vYmlsZSIsIm9yZGVyIiwiREVMRVRFIiwiX3JlcXVlc3QiLCJkZWxldGUiLCJzdWNjZXNzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/admin/projects/[id]/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/auth.ts":
/*!*********************!*\
  !*** ./lib/auth.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   getSessionCookie: () => (/* binding */ getSessionCookie),\n/* harmony export */   getSessionCookieName: () => (/* binding */ getSessionCookieName),\n/* harmony export */   hashPassword: () => (/* binding */ hashPassword),\n/* harmony export */   isAuthenticated: () => (/* binding */ isAuthenticated),\n/* harmony export */   isValidSession: () => (/* binding */ isValidSession)\n/* harmony export */ });\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! crypto */ \"crypto\");\n/* harmony import */ var crypto__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(crypto__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst COOKIE_NAME = \"jfcr_admin_session\";\nfunction hashPassword(password) {\n    return (0,crypto__WEBPACK_IMPORTED_MODULE_1__.createHash)(\"sha256\").update(password).digest(\"hex\");\n}\nfunction isValidSession(sessionValue) {\n    const adminPassword = process.env.ADMIN_PASSWORD || \"admin123\";\n    const expected = hashPassword(adminPassword);\n    return sessionValue === expected;\n}\nasync function getSessionCookie() {\n    const cookieStore = await (0,next_headers__WEBPACK_IMPORTED_MODULE_0__.cookies)();\n    return cookieStore.get(COOKIE_NAME)?.value;\n}\nasync function isAuthenticated() {\n    const session = await getSessionCookie();\n    if (!session) return false;\n    return isValidSession(session);\n}\nfunction getSessionCookieName() {\n    return COOKIE_NAME;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aC50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUF1QztBQUNIO0FBRXBDLE1BQU1FLGNBQWM7QUFFYixTQUFTQyxhQUFhQyxRQUFnQjtJQUMzQyxPQUFPSCxrREFBVUEsQ0FBQyxVQUFVSSxNQUFNLENBQUNELFVBQVVFLE1BQU0sQ0FBQztBQUN0RDtBQUVPLFNBQVNDLGVBQWVDLFlBQW9CO0lBQ2pELE1BQU1DLGdCQUFnQkMsUUFBUUMsR0FBRyxDQUFDQyxjQUFjLElBQUk7SUFDcEQsTUFBTUMsV0FBV1YsYUFBYU07SUFDOUIsT0FBT0QsaUJBQWlCSztBQUMxQjtBQUVPLGVBQWVDO0lBQ3BCLE1BQU1DLGNBQWMsTUFBTWYscURBQU9BO0lBQ2pDLE9BQU9lLFlBQVlDLEdBQUcsQ0FBQ2QsY0FBY2U7QUFDdkM7QUFFTyxlQUFlQztJQUNwQixNQUFNQyxVQUFVLE1BQU1MO0lBQ3RCLElBQUksQ0FBQ0ssU0FBUyxPQUFPO0lBQ3JCLE9BQU9aLGVBQWVZO0FBQ3hCO0FBRU8sU0FBU0M7SUFDZCxPQUFPbEI7QUFDVCIsInNvdXJjZXMiOlsid2VicGFjazovL2pmY3ItcG9ydGZvbGlvLy4vbGliL2F1dGgudHM/YmY3ZSJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb29raWVzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuaW1wb3J0IHsgY3JlYXRlSGFzaCB9IGZyb20gXCJjcnlwdG9cIjtcblxuY29uc3QgQ09PS0lFX05BTUUgPSBcImpmY3JfYWRtaW5fc2Vzc2lvblwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaGFzaFBhc3N3b3JkKHBhc3N3b3JkOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gY3JlYXRlSGFzaChcInNoYTI1NlwiKS51cGRhdGUocGFzc3dvcmQpLmRpZ2VzdChcImhleFwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRTZXNzaW9uKHNlc3Npb25WYWx1ZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IGFkbWluUGFzc3dvcmQgPSBwcm9jZXNzLmVudi5BRE1JTl9QQVNTV09SRCB8fCBcImFkbWluMTIzXCI7XG4gIGNvbnN0IGV4cGVjdGVkID0gaGFzaFBhc3N3b3JkKGFkbWluUGFzc3dvcmQpO1xuICByZXR1cm4gc2Vzc2lvblZhbHVlID09PSBleHBlY3RlZDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFNlc3Npb25Db29raWUoKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgY29va2llU3RvcmUgPSBhd2FpdCBjb29raWVzKCk7XG4gIHJldHVybiBjb29raWVTdG9yZS5nZXQoQ09PS0lFX05BTUUpPy52YWx1ZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzQXV0aGVudGljYXRlZCgpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgY29uc3Qgc2Vzc2lvbiA9IGF3YWl0IGdldFNlc3Npb25Db29raWUoKTtcbiAgaWYgKCFzZXNzaW9uKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBpc1ZhbGlkU2Vzc2lvbihzZXNzaW9uKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNlc3Npb25Db29raWVOYW1lKCk6IHN0cmluZyB7XG4gIHJldHVybiBDT09LSUVfTkFNRTtcbn1cbiJdLCJuYW1lcyI6WyJjb29raWVzIiwiY3JlYXRlSGFzaCIsIkNPT0tJRV9OQU1FIiwiaGFzaFBhc3N3b3JkIiwicGFzc3dvcmQiLCJ1cGRhdGUiLCJkaWdlc3QiLCJpc1ZhbGlkU2Vzc2lvbiIsInNlc3Npb25WYWx1ZSIsImFkbWluUGFzc3dvcmQiLCJwcm9jZXNzIiwiZW52IiwiQURNSU5fUEFTU1dPUkQiLCJleHBlY3RlZCIsImdldFNlc3Npb25Db29raWUiLCJjb29raWVTdG9yZSIsImdldCIsInZhbHVlIiwiaXNBdXRoZW50aWNhdGVkIiwic2Vzc2lvbiIsImdldFNlc3Npb25Db29raWVOYW1lIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/auth.ts\n");

/***/ }),

/***/ "(rsc)/./lib/prisma.ts":
/*!***********************!*\
  !*** ./lib/prisma.ts ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   prisma: () => (/* binding */ prisma)\n/* harmony export */ });\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _prisma_adapter_better_sqlite3__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prisma/adapter-better-sqlite3 */ \"(rsc)/./node_modules/@prisma/adapter-better-sqlite3/dist/index.mjs\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! path */ \"path\");\n/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_1__);\n\n\n\nconst globalForPrisma = globalThis;\nfunction createPrismaClient() {\n    const dbPath = path__WEBPACK_IMPORTED_MODULE_1___default().join(process.cwd(), \"dev.db\");\n    const adapter = new _prisma_adapter_better_sqlite3__WEBPACK_IMPORTED_MODULE_2__.PrismaBetterSqlite3({\n        url: `file:${dbPath}`\n    });\n    return new _prisma_client__WEBPACK_IMPORTED_MODULE_0__.PrismaClient({\n        adapter\n    });\n}\nconst prisma = globalForPrisma.prisma ?? createPrismaClient();\nif (true) {\n    globalForPrisma.prisma = prisma;\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcHJpc21hLnRzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUE4QztBQUN1QjtBQUM3QztBQUV4QixNQUFNRyxrQkFBa0JDO0FBSXhCLFNBQVNDO0lBQ1AsTUFBTUMsU0FBU0osZ0RBQVMsQ0FBQ00sUUFBUUMsR0FBRyxJQUFJO0lBQ3hDLE1BQU1DLFVBQVUsSUFBSVQsK0VBQW1CQSxDQUFDO1FBQUVVLEtBQUssQ0FBQyxLQUFLLEVBQUVMLE9BQU8sQ0FBQztJQUFDO0lBQ2hFLE9BQU8sSUFBSU4sd0RBQVlBLENBQUM7UUFBRVU7SUFBUTtBQUNwQztBQUVPLE1BQU1FLFNBQVNULGdCQUFnQlMsTUFBTSxJQUFJUCxxQkFBcUI7QUFFckUsSUFBSUcsSUFBcUMsRUFBRTtJQUN6Q0wsZ0JBQWdCUyxNQUFNLEdBQUdBO0FBQzNCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vamZjci1wb3J0Zm9saW8vLi9saWIvcHJpc21hLnRzPzk4MjIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUHJpc21hQ2xpZW50IH0gZnJvbSBcIkBwcmlzbWEvY2xpZW50XCI7XG5pbXBvcnQgeyBQcmlzbWFCZXR0ZXJTcWxpdGUzIH0gZnJvbSBcIkBwcmlzbWEvYWRhcHRlci1iZXR0ZXItc3FsaXRlM1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcblxuY29uc3QgZ2xvYmFsRm9yUHJpc21hID0gZ2xvYmFsVGhpcyBhcyB1bmtub3duIGFzIHtcbiAgcHJpc21hOiBQcmlzbWFDbGllbnQgfCB1bmRlZmluZWQ7XG59O1xuXG5mdW5jdGlvbiBjcmVhdGVQcmlzbWFDbGllbnQoKSB7XG4gIGNvbnN0IGRiUGF0aCA9IHBhdGguam9pbihwcm9jZXNzLmN3ZCgpLCBcImRldi5kYlwiKTtcbiAgY29uc3QgYWRhcHRlciA9IG5ldyBQcmlzbWFCZXR0ZXJTcWxpdGUzKHsgdXJsOiBgZmlsZToke2RiUGF0aH1gIH0pO1xuICByZXR1cm4gbmV3IFByaXNtYUNsaWVudCh7IGFkYXB0ZXIgfSk7XG59XG5cbmV4cG9ydCBjb25zdCBwcmlzbWEgPSBnbG9iYWxGb3JQcmlzbWEucHJpc21hID8/IGNyZWF0ZVByaXNtYUNsaWVudCgpO1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiKSB7XG4gIGdsb2JhbEZvclByaXNtYS5wcmlzbWEgPSBwcmlzbWE7XG59XG4iXSwibmFtZXMiOlsiUHJpc21hQ2xpZW50IiwiUHJpc21hQmV0dGVyU3FsaXRlMyIsInBhdGgiLCJnbG9iYWxGb3JQcmlzbWEiLCJnbG9iYWxUaGlzIiwiY3JlYXRlUHJpc21hQ2xpZW50IiwiZGJQYXRoIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJhZGFwdGVyIiwidXJsIiwicHJpc21hIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./lib/prisma.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@prisma"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&page=%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fadmin%2Fprojects%2F%5Bid%5D%2Froute.ts&appDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2FUsers%2Fjuanfelipe.cadavidrojas%2FDocuments%2FPersonal%2FAI%20experiments%2Fjfcr-portfolio&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();
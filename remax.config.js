/*
 * @Author: KeMull
 * @Date: 2021-05-21 16:04:16
 * @LastEditors: KeMull
 * @LastEditTime: 2021-05-21 16:07:58
 */
const less = require("@remax/plugin-less")
module.exports = {
	plugins: [
		less({
			lessOptions: {
				globalVars: {
					"primary-color": '"#4569d4"',
				},
			},
		}),
	],
}

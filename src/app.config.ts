/*
 * @Author: KeMull
 * @Date: 2021-05-21 16:04:16
 * @LastEditors: KeMull
 * @LastEditTime: 2021-05-21 16:40:34
 */
import { AppConfig } from "remax/wechat"

const config: AppConfig = {
	pages: ["pages/index/index", "pages/about/index"],
	window: {
		navigationBarTitleText: "欢迎来到",
		navigationBarBackgroundColor: "#282c34",
	},
	tabBar: {
		color: "#000000",
		selectedColor: "#000000",
		backgroundColor: "#fff",
		borderStyle: "white",
		list: [
			{
				pagePath: "pages/index/index",
				text: "组件",
			},
			{
				pagePath: "pages/about/index",
				text: "接口",
			},
		],
		position: "bottom",
	},
}

export default config

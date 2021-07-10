/*
 * @Author: KeMull
 * @Date: 2021-05-21 16:04:16
 * @LastEditors: KeMull
 * @LastEditTime: 2021-06-25 17:12:05
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
				text: "首页",
				pagePath: "pages/index/index",
				iconPath: "images/home.png",
				selectedIconPath: "images/home_choosed.png",
			},
			{
				text: "关于我们",
				pagePath: "pages/about/index",
				iconPath: "images/about.png",
				selectedIconPath: "images/home_choosed.png",
			},
		],
		position: "bottom",
	},
}

export default config

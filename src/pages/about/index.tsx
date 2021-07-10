/*
 * @Author: KeMull
 * @Date: 2021-05-21 16:20:45
 * @LastEditors: KeMull
 * @LastEditTime: 2021-07-07 09:57:53
 */
import * as React from "react"
import { View, Image } from "remax/wechat"
import styles from "./index.less"
import remax1 from "../../../public/images/remax_01.jpg"
export default () => {
	return (
		<View className={styles.app}>
			<View className={styles.header}>
				<Image src={remax1} className="about_us" mode="widthFix" />
				<View className={styles.text}>
					一碗仙缘是一个致力于用户随心笔记,阅读,备忘录的一体化平台。
				</View>
				<View className={styles.text}>
					平台将为用户提供一个简单、轻巧、干净、整洁的记事本,解决忘记某些事,导致的一系列后果。
				</View>
			</View>
		</View>
	)
}

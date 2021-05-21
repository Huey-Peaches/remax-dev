/*
 * @Author: KeMull
 * @Date: 2021-05-21 16:20:45
 * @LastEditors: KeMull
 * @LastEditTime: 2021-05-21 16:21:31
 */
import * as React from "react"
import { View, Text, Image } from "remax/wechat"
import styles from "./index.less"

export default () => {
	return (
		<View className={styles.app}>
			<View className={styles.header}>
				<View className={styles.text}>
					关于 <Text className={styles.path}>src/pages/index/index.js</Text>
					开始
				</View>
			</View>
		</View>
	)
}

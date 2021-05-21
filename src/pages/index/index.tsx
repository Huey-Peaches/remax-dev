import * as React from "react"
import { View, Text, Image } from "remax/wechat"
import styles from "./index.less"

export default () => {
	return (
		<View className={styles.app}>
			<View className={styles.header}>
				<View className={styles.text}>
					编辑 <Text className={styles.path}>src/pages/index/index.js</Text>
					开始
				</View>
			</View>
		</View>
	)
}

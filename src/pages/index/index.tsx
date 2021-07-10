/*
 * @Author: KeMull
 * @Date: 2021-05-21 16:04:16
 * @LastEditors: KeMull
 * @LastEditTime: 2021-07-07 10:34:12
 */
import * as React from "react"
import {
	View,
	Text,
	Button,
	Image,
	setStorageSync,
	openBluetoothAdapter,
	getBluetoothAdapterState,
	startBluetoothDevicesDiscovery,
	onBluetoothDeviceFound,
	createBLEConnection,
	getBLEDeviceServices,
	getBLEDeviceCharacteristics,
	onBluetoothAdapterStateChange,
	writeBLECharacteristicValue,
	onBLECharacteristicValueChange,
	closeBLEConnection,
	notifyBLECharacteristicValueChange,
	stopBluetoothDevicesDiscovery,
	showToast,
} from "remax/wechat"
import remax2 from "../../../public/images/remax_02.jpg"
import remax3 from "../../../public/images/remax_03.jpg"

import styles from "./index.less"
import { navigateTo, chooseImage } from "remax/ali"
export default () => {
	try {
		setStorageSync("13", "321321")
	} catch (e) {}
	let blueApi = {
		cfg: {
			device_info: "AAA",
			server_info: "BBB",
			onOpenNotify: null,
		},
		blue_data: {
			device_id: "",
			service_id: "",
			write_id: "",
		},
		setCfg(obj: Object) {
			this.cfg = Object.assign({}, this.cfg, obj)
		},
		// 初始化蓝牙
		connect() {
			if (!openBluetoothAdapter) {
				showToast({
					title:
						"当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
				})
				return
			}
			const _this = this
			openBluetoothAdapter({
				success(res) {
					console.log(
						"初始化 - success: ",
						"font-size:20px;background-color: #2EAFB0;color:#fff;",
						res
					)
				},
				fail(res) {
					if (res.errCode === 10001) {
						onBluetoothAdapterStateChange(function (res) {
							console.log(
								"监听蓝牙适配器状态变 - onBluetoothAdapterStateChange: ",
								"font-size:20px;background-color: #FFDD4D;color:#fff;",
								res
							)
							if (res.available) {
								setTimeout(function () {
									_this.getBlueState()
								}, 2000)
							}
						})
					}
				},
			})
		},
		//发送消息
		sendMsg(msg: any, toArrayBuf = true) {
			console.log("进来了")
			let _this = this
			let buf = toArrayBuf ? this.hexStringToArrayBuffer(msg) : msg
			writeBLECharacteristicValue({
				deviceId: _this.blue_data.device_id,
				serviceId: _this.blue_data.service_id,
				characteristicId: _this.blue_data.write_id,
				value: buf,
				success: function (res) {
					console.log(res)
				},
			})
		},
		//监听消息
		onNotifyChange(callback?: Function) {
			var _this = this
			onBLECharacteristicValueChange(function (res) {
				let msg = _this.arrayBufferToHexString(res.value)
				callback && callback(msg)
				console.log(msg)
			})
		},
		disconnect() {
			var _this = this
			closeBLEConnection({
				deviceId: _this.blue_data.device_id,
				success(res) {},
			})
		},
		/*事件通信模块*/

		/*连接设备模块*/
		getBlueState() {
			const _this = this
			console.log(
				"%c 🍢 _this.blue_data: ",
				"font-size:20px;background-color: #FFDD4D;color:#fff;",
				_this.blue_data
			)
			if (_this.blue_data.device_id != "") {
				_this.connectDevice()
				return
			}

			getBluetoothAdapterState({
				success: function (res) {
					console.log(
						"获取本机蓝牙适配器状态 - getBluetoothAdapterState : ",
						"font-size:20px;background-color: #2EAFB0;color:#fff;",
						res
					)
					if (!!res && res.available) {
						//蓝牙可用
						_this.startSearch()
					}
				},
			})
		},
		startSearch() {
			console.log("startSearch  进来了")
			const _this = this
			startBluetoothDevicesDiscovery({
				services: [],
				success(res) {
					onBluetoothDeviceFound(function (res) {
						console.log(
							"%c 🥤 res: ",
							"font-size:20px;background-color: #7F2B82;color:#fff;",
							res
						)
						var device = _this.filterDevice(res.devices)
						if (device) {
							console.log(
								"%c 🍱 device: ",
								"font-size:20px;background-color: #B03734;color:#fff;",
								device
							)
							_this.blue_data.device_id = device.deviceId
							_this.stopSearch()
							_this.connectDevice()
						}
					})
				},
			})
		},
		//连接到设备
		connectDevice() {
			console.log("connectDevice 进来了")
			var _this = this
			createBLEConnection({
				deviceId: _this.blue_data.device_id,
				success(res) {
					console.log(
						"connectDevice: ",
						"font-size:20px;background-color: #B03734;color:#fff;",
						res
					)
					_this.getDeviceService()
				},
			})
		},
		//搜索设备服务
		getDeviceService() {
			var _this = this
			getBLEDeviceServices({
				deviceId: _this.blue_data.device_id,
				success: function (res) {
					var service_id = _this.filterService(res.services)
					if (service_id != "") {
						_this.blue_data.service_id = service_id
						_this.getDeviceCharacter()
					}
				},
			})
		},
		//获取连接设备的所有特征值
		getDeviceCharacter() {
			let _this = this
			getBLEDeviceCharacteristics({
				deviceId: _this.blue_data.device_id,
				serviceId: _this.blue_data.service_id,
				success: function (res) {
					let notify_id, write_id, read_id
					for (let i = 0; i < res.characteristics.length; i++) {
						let charc = res.characteristics[i]
						if (charc.properties.notify) {
							notify_id = charc.uuid
						}
						if (charc.properties.write) {
							write_id = charc.uuid
						}
						if (charc.properties.write) {
							read_id = charc.uuid
						}
					}
					if (notify_id != null && write_id != null) {
						_this.blue_data.notify_id = notify_id
						_this.blue_data.write_id = write_id
						_this.blue_data.read_id = read_id

						_this.openNotify()
					}
				},
			})
		},
		openNotify() {
			const _this = this
			notifyBLECharacteristicValueChange({
				state: true,
				deviceId: _this.blue_data.device_id,
				serviceId: _this.blue_data.service_id,
				characteristicId: _this.blue_data.notify_id,
				complete(res) {
					setTimeout(function () {
						_this.cfg.onOpenNotify && _this.cfg.onOpenNotify()
					}, 1000)
					_this.onNotifyChange() //接受消息
				},
			})
		},
		/*连接设备模块*/

		/*其他辅助模块*/
		//停止搜索周边设备
		stopSearch() {
			var _this = this
			stopBluetoothDevicesDiscovery({
				success: function (res) {},
			})
		},
		arrayBufferToHexString(buffer: any) {
			let bufferType = Object.prototype.toString.call(buffer)
			if (buffer != "[object ArrayBuffer]") {
				return
			}
			let dataView = new DataView(buffer)

			var hexStr = ""
			for (var i = 0; i < dataView.byteLength; i++) {
				var str = dataView.getUint8(i)
				var hex = (str & 0xff).toString(16)
				hex = hex.length === 1 ? "0" + hex : hex
				hexStr += hex
			}

			return hexStr.toUpperCase()
		},
		hexStringToArrayBuffer(str) {
			if (!str) {
				return new ArrayBuffer(0)
			}

			var buffer = new ArrayBuffer(str.length)
			let dataView = new DataView(buffer)

			let ind = 0
			for (var i = 0, len = str.length; i < len; i += 2) {
				let code = parseInt(str.substr(i, 2), 16)
				dataView.setUint8(ind, code)
				ind++
			}

			return buffer
		},
		//过滤目标设备
		filterDevice(device: any) {
			var data = blueApi.arrayBufferToHexString(device[0].advertisData)
			console.log(
				"%c 🥑 data: ",
				"font-size:20px;background-color: #2EAFB0;color:#fff;",
				data
			)
			if (
				data &&
				data.indexOf(this.cfg.device_info.substr(4).toUpperCase()) > -1
			) {
				var obj = { name: device[0].name, deviceId: device[0].deviceId }
				return obj
			} else {
				return null
			}
		},
		//过滤主服务
		filterService(services: any) {
			let service_id = ""
			for (let i = 0; i < services.length; i++) {
				if (services[i].uuid.toUpperCase().indexOf(this.server_info) != -1) {
					service_id = services[i].uuid
					break
				}
			}

			return service_id
		},
		/*其他辅助模块*/
	}

	const click = () => {
		blueApi.setCfg({
			device_info: "AAA",
			server_info: "BBB",
			onOpenNotify: function () {
				console.log("321312")
				blueApi.sendMsg("test")
			},
		})
		console.log(
			"%c 🥪 blueApi: ",
			"font-size:20px;background-color: #ED9EC7;color:#fff;",
			blueApi
		)

		blueApi.connect()
	}
	return (
		<View className={styles.app}>
			<View className={styles.header}>
				<Image src={remax3} className="img2"></Image>
				<View className={styles.text}>
					相比传统的纸笔笔记,会有些不方便,出门都会随身携带笔和记事本
				</View>
				<View className={styles.text}>
					一碗仙缘是解决传统的笔记的不便,构建一个更轻,更快,更方便的云笔记
				</View>
				{/* <Button
					type="primary"
					open-type="contact"
					session-from='{"params":"a=1&b=2&id=5"}'
				>
					芝麻小助手
				</Button> */}
			</View>
		</View>
	)
}

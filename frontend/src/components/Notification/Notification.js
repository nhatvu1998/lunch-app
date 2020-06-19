import { notification } from 'antd'
export default function openNotification (type, message, des) {
  notification[type]({
    message: message,
    description: des,
    placement: 'bottomRight',
    duration: 2
  })
}
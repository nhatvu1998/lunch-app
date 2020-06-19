# Hướng dẫn cài đặt
1. Install dependencies
Chạy lệnh ```npm install```
2. Cài extension Eslint vào VSCode (nếu chưa có)
3. Thêm config bên dưới vào VSCode Setting
- Bấm tổ hợp phím Ctrl + Shift + P
- Gõ **Preferences: Open Settings (JSON)**
- Thêm config dưới đây
```json
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "typescript",
  "typescriptreact"
],
```
# Hướng dẫn sử dụng
Cần xác định cổng (port) để chạy Server và cổng (port) để chạy MongoDB

Các bạn tham khảo port range của mình tại file PJ Analytic FK tại [đây](https://docs.google.com/spreadsheets/d/1nB0rykJk3O-KErC2MbGuUwE8byurEoc8PU4yVW_y_yc/edit#gid=0)

VD: port mongodb của tôi là 11019 và tôi muốn chạy backend ở port 11015, tôi sẽ chạy lệnh sau:

```MONGO=11019 APP=11015 npm run start:dev```
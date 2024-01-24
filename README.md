# nodejs-typescript-init-project
>Mục tiêu là khởi tạo dự án mẫu sử dụng nodejs typescript eslint prettier

### Cài đặt gói
``` javascript
npm install
```
### Câu lệnh chạy dự án
Chạy dự án trong môi trường dev

```bash
npm run dev
```

Build dự án TypeScript sang JavaScript cho production
Có thể các bạn sẽ hỏi rằng tại sao phải build, để nguyên TypeScript thì luôn vẫn được mà. Đúng vậy nhưng khi build thì chúng ta sẽ có những lợi ích sau

- Code chạy được mà không cần cài đặt TypeScript
- Chạy nhanh hơn vì đã được biên dịch rồi
- Có thể minify code để giảm dung lượng
- Code chạy được trên những mội trường không hỗ trợ TypeScript

Để build thì chạy câu lệnh sau

```bash
npm run build
```

Tiếp theo chạy câu lệnh sau để chạy dự án, lưu ý câu lệnh này đòi hỏi bạn phải build trước để có code trong thư mục dist

```bash
npm run start
```

Kiểm tra lỗi ESLint / Prettier
Câu lệnh này sẽ giúp bạn kiểm tra lỗi ESLint trong dự án

```bash
npm run lint
```

Nếu bạn muốn ESLint tự động fix lỗi thì chạy câu lệnh sau

```bash
npm run lint:fix
```

Tương tự với Prettier, ta có câu lệnh

```bash
npm run prettier
```

```bash
npm run prettier:fix
```
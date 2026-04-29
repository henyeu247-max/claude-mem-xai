# 🚀 Quick Start Scripts

Các script hỗ trợ cài đặt và quản lý claude-mem-xai trên Windows.

---

## 📦 Scripts Có Sẵn

### **1. setup.bat** - Cài đặt ban đầu
Chạy script này lần đầu tiên để cài đặt toàn bộ dự án.

```bash
setup.bat
```

**Chức năng:**
- ✅ Kiểm tra Node.js, Git
- ✅ Cài đặt dependencies (npm install)
- ✅ Build dự án (npm run build)
- ✅ Khởi động worker service
- ✅ Hiển thị hướng dẫn tiếp theo

---

### **2. start-worker.bat** - Khởi động worker
Khởi động worker service (dùng cho auto-start).

```bash
start-worker.bat
```

**Chức năng:**
- ✅ Kiểm tra Node.js
- ✅ Tự động cài dependencies nếu thiếu
- ✅ Tự động build nếu thiếu
- ✅ Khởi động worker service

**Dùng cho:**
- Task Scheduler (auto-start khi khởi động máy)
- Startup folder
- Khởi động thủ công

---

### **3. check-system.bat** - Kiểm tra hệ thống
Kiểm tra trạng thái và tối ưu hóa.

```bash
check-system.bat
```

**Chức năng:**
- ✅ Kiểm tra Node.js, Bun
- ✅ Kiểm tra worker service status
- ✅ Kiểm tra settings (Chroma, provider)
- ✅ Kiểm tra port 37777
- ✅ Kiểm tra database, logs
- ✅ Hiển thị CPU/RAM usage
- ✅ Đưa ra gợi ý tối ưu hóa

---

## 📄 Files Cấu Hình

### **settings.example.json** - Mẫu cấu hình
File mẫu cho `~/.claude-mem/settings.json`

**Vị trí thực tế:**
```
C:\Users\<YourName>\.claude-mem\settings.json
```

**Cấu hình quan trọng:**
```json
{
  "CLAUDE_MEM_PROVIDER": "xai",
  "CLAUDE_MEM_XAI_API_KEY": "xai-your-api-key-here",
  "CLAUDE_MEM_CHROMA_ENABLED": "false"
}
```

---

## 🔧 Cài Đặt Auto-Start

### **Phương án 1: Task Scheduler (Khuyến nghị)**

1. Mở Task Scheduler: `Win + R` → `taskschd.msc`
2. Create Task:
   - Name: `Claude-Mem-xAI Worker`
   - Trigger: **At startup** (delay 30s)
   - Action: Run `start-worker.bat`
   - Settings: Restart on failure (3 times)

### **Phương án 2: Startup Folder**

1. Tạo shortcut của `start-worker.bat`
2. Copy vào: `Win + R` → `shell:startup`
3. Restart máy để test

---

## 📊 Lệnh NPM Hữu Ích

```bash
# Quản lý worker
npm run worker:start    # Khởi động
npm run worker:stop     # Dừng
npm run worker:restart  # Khởi động lại
npm run worker:status   # Kiểm tra trạng thái

# Xem logs
npm run worker:logs     # Xem 50 dòng cuối
npm run worker:tail     # Theo dõi real-time

# Build
npm run build           # Build lại dự án
npm run build-and-sync  # Build + sync + restart
```

---

## 🐛 Xử Lý Lỗi

### **Worker không start:**
```bash
# Kiểm tra port
netstat -ano | findstr :37777

# Kill process nếu cần
taskkill /PID <PID> /F

# Start lại
npm run worker:start
```

### **Chroma vẫn chạy (CPU cao):**
```bash
# Kiểm tra settings
type %USERPROFILE%\.claude-mem\settings.json | findstr CHROMA

# Phải thấy: "CLAUDE_MEM_CHROMA_ENABLED": "false"
```

### **Build failed:**
```bash
# Xóa và cài lại
rmdir /s /q node_modules
npm install
npm run build
```

---

## ✅ Checklist Cài Đặt

- [ ] Chạy `setup.bat` thành công
- [ ] Worker service đang chạy (port 37777)
- [ ] Settings đã cấu hình xAI API key
- [ ] Chroma đã TẮT (check-system.bat)
- [ ] Auto-start đã cấu hình (Task Scheduler)
- [ ] Test trong Claude Code: `/mem-search "test"`

---

## 📖 Tài Liệu Đầy Đủ

Xem [INSTALL.md](INSTALL.md) để có hướng dẫn chi tiết đầy đủ.

---

**Made with ❤️ by henyeu247-max**

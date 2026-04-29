# 📦 Hướng Dẫn Cài Đặt claude-mem-xai

> **Hướng dẫn đầy đủ để cài đặt và cấu hình claude-mem-xai tự động chạy khi khởi động máy**

---

## 📋 Yêu Cầu Hệ Thống

### **Phần Mềm Cần Thiết:**

1. **Node.js** >= 18.0.0
   - Download: https://nodejs.org/
   - Kiểm tra: `node --version`

2. **Bun** (tự động cài nếu chưa có)
   - Windows: Tự động cài qua npm
   - Kiểm tra: `bun --version`

3. **Git**
   - Download: https://git-scm.com/
   - Kiểm tra: `git --version`

4. **Claude Code CLI**
   - Download: https://claude.com/claude-code
   - Kiểm tra: `claude --version`

---

## 🚀 Bước 1: Clone Dự Án

```bash
# Clone repository
git clone https://github.com/henyeu247-max/claude-mem-xai.git

# Di chuyển vào thư mục
cd claude-mem-xai

# Kiểm tra branch
git branch
# Phải thấy: * xai-only
```

---

## 📦 Bước 2: Cài Đặt Dependencies

```bash
# Cài đặt packages
npm install

# Build dự án
npm run build
```

**Kết quả mong đợi:**
```
✅ Worker service, MCP server, and context generator built successfully!
```

---

## ⚙️ Bước 3: Cấu Hình xAI API Key

### **3.1. Lấy API Key từ xAI:**

1. Truy cập: https://console.x.ai/
2. Đăng nhập
3. Vào **API Keys** → **Create New Key**
4. Copy API key (dạng: `xai-xxxxxxxxxxxxx`)

### **3.2. Cấu hình trong claude-mem:**

**Cách 1: Qua UI (Khuyến nghị)**

```bash
# Khởi động worker service
npm run worker:start

# Mở trình duyệt
# Truy cập: http://localhost:37777
```

Trong UI:
1. Click **Settings** (⚙️)
2. Chọn tab **AI Provider**
3. Chọn **xAI** từ dropdown
4. Paste API key vào ô **xAI API Key**
5. Chọn model: **grok-4-1-fast-non-reasoning**
6. Click **Save**

**Cách 2: Qua File Settings**

Tạo/sửa file: `~/.claude-mem/settings.json`

```json
{
  "CLAUDE_MEM_PROVIDER": "xai",
  "CLAUDE_MEM_XAI_API_KEY": "xai-your-api-key-here",
  "CLAUDE_MEM_XAI_MODEL": "grok-4-1-fast-non-reasoning",
  "CLAUDE_MEM_CHROMA_ENABLED": "false",
  "CLAUDE_MEM_WORKER_PORT": "37777",
  "CLAUDE_MEM_LOG_LEVEL": "INFO"
}
```

---

## 🔧 Bước 4: Cài Đặt Plugin vào Claude Code

### **4.1. Sync Plugin:**

```bash
# Sync plugin vào Claude Code
npm run sync-marketplace
```

### **4.2. Khởi động Worker Service:**

```bash
# Start worker service
npm run worker:start

# Kiểm tra status
npm run worker:status
```

**Kết quả mong đợi:**
```
✅ Worker service is running
   PID: xxxxx
   Port: 37777
   Uptime: xx seconds
```

### **4.3. Kiểm tra trong Claude Code:**

```bash
# Mở Claude Code
claude

# Trong Claude Code, gõ:
/help

# Phải thấy các lệnh claude-mem:
# - /mem-search
# - /make-plan
# - /do
```

---

## 🚀 Bước 5: Cấu Hình Auto-Start (Tự Động Chạy Khi Khởi Động)

### **Windows (Khuyến nghị):**

#### **Phương án 1: Task Scheduler (Tốt nhất)**

1. **Tạo file batch script:**

Tạo file: `C:\claude-mem-xai\start-worker.bat`

```batch
@echo off
cd /d C:\claude-mem-xai
call npm run worker:start
```

2. **Mở Task Scheduler:**
   - Nhấn `Win + R` → gõ `taskschd.msc` → Enter

3. **Tạo Task mới:**
   - Click **Create Task** (bên phải)
   - **General tab:**
     - Name: `Claude-Mem-xAI Worker`
     - Description: `Auto-start claude-mem-xai worker service`
     - ✅ Run whether user is logged on or not
     - ✅ Run with highest privileges
     - Configure for: **Windows 10/11**

4. **Triggers tab:**
   - Click **New**
   - Begin the task: **At startup**
   - Delay task for: **30 seconds** (để Windows khởi động xong)
   - ✅ Enabled
   - Click **OK**

5. **Actions tab:**
   - Click **New**
   - Action: **Start a program**
   - Program/script: `C:\claude-mem-xai\start-worker.bat`
   - Start in: `C:\claude-mem-xai`
   - Click **OK**

6. **Conditions tab:**
   - ❌ Bỏ tích: "Start the task only if the computer is on AC power"

7. **Settings tab:**
   - ✅ Allow task to be run on demand
   - ✅ Run task as soon as possible after a scheduled start is missed
   - If the task fails, restart every: **1 minute**
   - Attempt to restart up to: **3 times**

8. **Click OK** → Nhập password Windows nếu được hỏi

#### **Phương án 2: Startup Folder (Đơn giản hơn)**

1. **Tạo shortcut:**
   - Right-click file `start-worker.bat`
   - Chọn **Create shortcut**

2. **Copy vào Startup folder:**
   - Nhấn `Win + R` → gõ `shell:startup` → Enter
   - Paste shortcut vào đây

3. **Restart máy để test**

---

## 🔍 Bước 6: Kiểm Tra và Xác Nhận

### **6.1. Kiểm tra Worker Service:**

```bash
# Kiểm tra status
npm run worker:status

# Xem logs
npm run worker:logs

# Kiểm tra port
curl http://localhost:37777/api/health
```

**Kết quả mong đợi:**
```json
{"status":"ok","uptime":123}
```

### **6.2. Kiểm tra trong Claude Code:**

```bash
claude

# Test memory search
/mem-search "test query"
```

### **6.3. Kiểm tra Chroma (phải TẮT):**

```bash
# Xem logs
npm run worker:logs | grep -i chroma
```

**Phải thấy:**
```
Chroma disabled via CLAUDE_MEM_CHROMA_ENABLED=false
```

### **6.4. Kiểm tra CPU Usage:**

**Windows:**
```powershell
# Mở Task Manager (Ctrl + Shift + Esc)
# Tìm process: bun.exe hoặc node.exe
# CPU phải < 5%
# RAM phải ~150-200 MB
```

---

## 🛠️ Bước 7: Tối Ưu Hóa

### **7.1. Giảm Log Level (nếu cần):**

Sửa `~/.claude-mem/settings.json`:

```json
{
  "CLAUDE_MEM_LOG_LEVEL": "WARN"
}
```

### **7.2. Tăng Performance:**

```json
{
  "CLAUDE_MEM_MAX_CONCURRENT_AGENTS": "1",
  "CLAUDE_MEM_CONTEXT_OBSERVATIONS": "30"
}
```

### **7.3. Tắt Features không cần:**

```json
{
  "CLAUDE_MEM_CONTEXT_SHOW_TERMINAL_OUTPUT": "false",
  "CLAUDE_MEM_FOLDER_CLAUDEMD_ENABLED": "false"
}
```

---

## 🔄 Bước 8: Update Dự Án (Khi Có Bản Mới)

```bash
# Di chuyển vào thư mục dự án
cd claude-mem-xai

# Pull code mới
git pull origin xai-only

# Cài đặt dependencies mới (nếu có)
npm install

# Build lại
npm run build

# Restart worker
npm run worker:restart
```

---

## 🐛 Xử Lý Lỗi Thường Gặp

### **Lỗi 1: Worker không start**

```bash
# Kiểm tra port có bị chiếm không
netstat -ano | findstr :37777

# Nếu có process, kill nó
taskkill /PID <PID> /F

# Start lại
npm run worker:start
```

### **Lỗi 2: API Key không hợp lệ**

```bash
# Kiểm tra settings
cat ~/.claude-mem/settings.json

# Test API key
curl -H "Authorization: Bearer xai-your-key" https://api.x.ai/v1/models
```

### **Lỗi 3: Build failed**

```bash
# Xóa node_modules và build lại
rm -rf node_modules
npm install
npm run build
```

### **Lỗi 4: Chroma vẫn chạy (CPU cao)**

```bash
# Kiểm tra settings
cat ~/.claude-mem/settings.json | grep CHROMA

# Phải thấy:
# "CLAUDE_MEM_CHROMA_ENABLED": "false"

# Nếu không, sửa lại và restart
npm run worker:restart
```

---

## 📊 Kiểm Tra Hiệu Suất

### **Benchmark Mong Đợi:**

| Metric | Giá Trị |
|--------|---------|
| CPU Usage | < 5% |
| RAM Usage | 150-200 MB |
| Startup Time | < 5 giây |
| Response Time | < 2 giây |
| Processes | 1-2 (không có chroma-mcp) |

### **Lệnh Kiểm Tra:**

```bash
# Windows
tasklist | findstr "bun\|node"

# Xem chi tiết
wmic process where "name='bun.exe'" get ProcessId,WorkingSetSize,CommandLine
```

---

## ✅ Checklist Hoàn Thành

- [ ] Node.js >= 18.0.0 đã cài
- [ ] Git đã cài
- [ ] Claude Code CLI đã cài
- [ ] Clone dự án thành công
- [ ] `npm install` thành công
- [ ] `npm run build` thành công
- [ ] xAI API key đã cấu hình
- [ ] Worker service chạy được
- [ ] Plugin sync vào Claude Code
- [ ] Auto-start đã cấu hình (Task Scheduler hoặc Startup)
- [ ] Chroma đã TẮT (kiểm tra logs)
- [ ] CPU < 5%, RAM ~150-200 MB
- [ ] Test `/mem-search` trong Claude Code thành công

---

## 🎉 Hoàn Tất!

Bây giờ claude-mem-xai sẽ:
- ✅ Tự động chạy khi khởi động máy
- ✅ Sử dụng xAI Grok API
- ✅ Chroma TẮT (CPU thấp)
- ✅ SQLite-only search
- ✅ Tối ưu hiệu suất

---

## 📞 Hỗ Trợ

- **Issues:** https://github.com/henyeu247-max/claude-mem-xai/issues
- **Original Project:** https://github.com/henyeu247-max/claude-mem-xai
- **xAI Docs:** https://docs.x.ai/

---

**Made with ❤️ by henyeu247-max**

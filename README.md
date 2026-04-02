# 动画角色登录页面 (Animated Login Page)

一个带有交互动画角色的 React 登录页面，采用 Vite 构建。

## 🎯 特性

- **交互动画角色**：左侧面板展示了四个可爱的动画角色（紫色、黑色、橙色、黄色），它们会响应用户的输入行为
- **智能眼睛跟随**：角色的眼睛会跟随鼠标移动，仿佛在观察你的操作
- **输入状态反馈**：
  - 输入邮箱时，角色会看向输入框
  - 输入密码时，角色会做出害羞反应（遮眼/转头）
  - 提交表单时，角色会摇头表示拒绝
- **视觉设计**：
  - 渐变背景配合柔和的模糊光效
  - 现代化表单设计，支持显示/隐藏密码
  - 按钮悬停动画效果
  - 响应式布局，移动端自动隐藏动画角色

## 🛠️ 技术栈

- React 18
- Vite
- Tailwind CSS
- CSS 动画

## 📦 安装与运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问本地地址（通常为 `http://localhost:5173`）。

## 📁 项目结构

```
src/
├── App.jsx                 # 主页面组件，包含登录表单逻辑
├── App.css                 # 全局样式
├── main.jsx                # React 入口
└── components/
    └── animated-characters/
        ├── AnimatedCharacters.jsx  # 动画角色核心组件
        └── index.js
```

## 🔌 复用动画组件

动画角色组件是独立可复用的，可以集成到其他项目中：

```jsx
import { AnimatedCharacters } from "./components";

<AnimatedCharacters
  isTyping={isTyping}
  isPasswordFocused={isPasswordFocused}
  showPassword={showPassword}
  passwordLength={password.length}
/>
```

### Props 说明

| Prop | 类型 | 说明 |
|------|------|------|
| `isTyping` | boolean | 是否正在输入（邮箱） |
| `isPasswordFocused` | boolean | 密码输入框是否获得焦点 |
| `showPassword` | boolean | 密码是否可见 |
| `passwordLength` | number | 密码长度 |

## 🎨 表单验证规则

- **邮箱**：必须为有效的邮箱格式
- **密码**：至少 6 个字符
- 错误信息会显示在表单下方

## 📝 License

MIT
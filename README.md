# login-react-standalone

A standalone React + Vite project that only contains the animated login page.

## Run

```bash
npm install
npm run dev
```

Then open the local Vite URL (usually `http://localhost:5173`).

## Reuse As Component

The character animation is reusable and exported from:

- `src/components/index.js`
- `src/AnimatedCharacters.jsx`

Usage:

```jsx
import { AnimatedCharacters } from "./components";

<AnimatedCharacters
  isTyping={isTyping}
  isPasswordFocused={isPasswordFocused}
  showPassword={showPassword}
  passwordLength={password.length}
/>;
```

# AGENTS.md - Development Guidelines for vue3-project

## Project Overview

This is a Vue 3 + Vite project using Composition API with `<script setup>`. The main project is located in `vue3-project/`.

## Build Commands

```sh
# Install dependencies
npm install

# Development server (hot reload)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint and fix code (runs oxlint + eslint)
npm run lint
```

### Lint Configuration

- Uses ESLint with flat config (`eslint.config.js`)
- Uses oxlint for additional linting
- oxlint config: `.oxlintrc.json`

## Code Style Guidelines

### Formatting

- **Indent**: 2 spaces (enforced by `.editorconfig`)
- **Line endings**: LF
- **Max line length**: 100 characters
- **Charset**: UTF-8
- Always use single quotes for strings
- Use `const` for variables that aren't reassigned; `let` otherwise
- Use arrow functions for callbacks

### Vue 3 Component Structure

Use `<script setup>` syntax:

```vue
<script setup>
// imports
// props/emits
// reactive state
// computed/watch
// methods
</script>

<template>
  <!-- HTML -->
</template>

<style scoped lang="scss">
/* scoped styles */
</style>
```

### Imports

- Vue imports at the top
- Absolute imports use `@/` alias (configured in `vite.config.js` and `jsconfig.json`)
- External imports before internal imports
- Example:

```js
import { ref, computed } from "vue";
import axios from "axios";
import "@/styles/common.scss";
import MyComponent from "@/components/MyComponent.vue";
```

### Naming Conventions

- **Components**: PascalCase (e.g., `UserProfile.vue`)
- **Variables/functions**: camelCase (e.g., `userName`, `getUserData`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `API_BASE_URL`)
- **CSS classes**: kebab-case (e.g., `.user-profile`)
- **Files**: kebab-case for utilities, PascalCase for components

### TypeScript/JavaScript

- This project uses plain JavaScript (no TypeScript)
- Use JSDoc comments for complex functions if needed
- Avoid `any` type (no TypeScript, but maintain type-like discipline)

### Error Handling

- Use try/catch for async operations
- Handle API errors gracefully
- Never expose sensitive information in error messages

### Vue Specific

- Props should be defined with default values when needed
- Use `defineProps` and `defineEmits` macros in `<script setup>`
- Use `ref()` for primitives, `reactive()` for objects
- Use `computed()` for derived state
- Use `watch()`/`watchEffect()` for side effects

### Styling

- Use SCSS with `<style scoped>`
- Variables available: `$priceColor`, `$xtxColor`, etc. (defined in `src/styles/var.scss`)
- Element Plus styles auto-imported via plugin
- Use mixins for repeated styles

### Component Organization

```
src/
├── apis/          # API functions
├── components/    # Reusable components
├── composables/   # Composable functions (hooks)
├── directives/    # Custom directives
├── router/        # Vue Router config
├── stores/        # Pinia stores
├── styles/        # Global styles
├── utils/         # Utility functions
└── views/         # Page components
```

### API Design

- API functions should be in `src/apis/`
- Return promises from API functions
- Handle loading and error states in components

### State Management

- Use Pinia for global state
- Use `pinia-plugin-persistedstate` for state persistence
- Component state uses Composition API (`ref`, `reactive`)

## Lint Commands

```sh
# Run full lint (oxlint + eslint with fixes)
npm run lint

# Run eslint only
npm run lint:eslint

# Run oxlint only
npm run lint:oxlint
```

## Important Notes

1. **Path Aliases**: Use `@/` to reference `src/` directory (e.g., `import '@/components/...'`)
2. **SCSS Variables**: Don't forget to use SCSS variables for consistent theming
3. **Auto-imports**: Element Plus components are auto-imported via `unplugin-vue-components`
4. **Browser Support**: Browser globals are configured in ESLint (`globals.browser`)
5. **Node Version**: Requires Node.js `^20.19.0 || >=22.12.0`

# 项目规则 - 小兔鲜 Vue3 电商前台

## 核心技术栈与风格要求

- 必须使用 Vue3 Composition API + <script setup lang="ts">
- 优先使用 ref() / reactive() / toRefs()，避免 ref.value 滥用
- 所有组件必须使用 defineProps / defineEmits，并写 TS 类型
- Pinia store 拆分成模块：user / cart / product / address
- 组件命名：PascalCase（如 ProductCard.vue）
- 文件路径：kebab-case（如 use-product-detail.ts）
- 优先使用 VueUse hooks（如 useDebounce、useStorage）

## 重构与修改规则

- Options API → Composition API 转换时，保持功能不变
- 提取重复逻辑到 src/composables/useXXX.ts
- 不要修改 node_modules、dist、public 等目录
- 所有新组件必须包含 props/emits 类型声明
- 性能优化优先：懒加载、虚拟列表、图片 WebP + 懒加载

## 其他约束

- 代码风格：ESLint + Prettier 强制遵守（单引号、semi: false）
- 注释：关键逻辑加 JSDoc
- 风险控制：任何大范围修改前，先输出 plan 并等待确认

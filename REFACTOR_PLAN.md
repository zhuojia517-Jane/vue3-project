# Composition API 重构规划 - 小兔鲜 Vue3 项目

## 1. 现状扫描与统计
经过对 `src/` 目录下所有 `.vue` 文件的扫描，结果如下：
- **Options API 使用情况**: 绝大部分组件已使用 `<script setup>`。
- **唯一存留 Options API**: `src/components/XtxSku/index.vue` 使用了 `export default { setup() }` 模式，而非 `<script setup>`。
- **逻辑重复**: 多个页面（Detail, Home, SubCategory）存在重复的 API 调用和数据处理逻辑。

## 2. 重构优先级
1. **基础设施**: `src/composables` 提取逻辑（降低页面耦合）。
2. **核心组件**: `XtxSku/index.vue` 迁移至 `<script setup>`。
3. **Store 优化**: 确保 Pinia Store 采用 Setup Store 风格（目前基本已是）。
4. **页面精简**: `Detail/index.vue`, `Home/home-index.vue` 逻辑瘦身。

## 3. 建议抽取的 Composables (Hooks)
| Hook 名称 | 逻辑内容 | 适用页面/组件 |
| :--- | :--- | :--- |
| `useProduct` | 获取商品详情、SKU 处理、加入购物车逻辑 | `Detail/index.vue`, `CartList/index.vue` |
| `useCategory` | 分类列表获取、面包屑逻辑 | `Category/index.vue`, `SubCategory/sub-index.vue` |
| `useCart` | 购物车列表操作、全选/单选逻辑封装 | `CartList/index.vue`, `HeaderCart.vue` |
| `useBanner` | 轮播图数据获取 | `Home/components/homeBanner.vue` |

## 4. Pinia Store 优化
目前 `stores/` 已经按模块拆分（user, cart, category）。建议：
- **统一风格**: 确保所有 store 使用 `defineStore('id', () => { ... })` 定义。
- **持久化**: 检查 `pinia-plugin-persistedstate` 配置是否覆盖所有需要本地存储的模块（如 user, cart）。

## 5. 风险点分析
- **Props 迁移**: 从 `setup(props)` 迁移到 `defineProps()` 时，注意解构会失去响应式，需使用 `toRefs`。
- **生命周期**: 确保 `onMounted` 逻辑在 Setup 模式下正确执行（避免在循环/条件分支中调用）。
- **Ref vs Reactive**: 
  - 建议：单值用 `ref`（如 `count`），表单/复杂对象用 `reactive`（如 `formData`）。
  - **重要**: 避免 `let skuObj = ref({})` 后直接 `skuObj = sku` 的错误赋值（应为 `skuObj.value = sku`）。

## 6. 结构化修改列表
| 文件路径 | 修改要点 | 潜在影响 |
| :--- | :--- | :--- |
| `src/components/XtxSku/index.vue` | 迁移到 `<script setup>`，使用 `defineProps` 和 `defineEmits` | 外部传入的 `goods` 属性需保持响应式 |
| `src/views/detail/index.vue` | 提取商品请求和购物车逻辑到 `useProduct` | 需确保 `skuObj` 的响应式更新不失效 |
| `src/views/home/home-index.vue` | 清理注释和冗余 slot，精简 setup 块 | UI 无影响，提升代码可读性 |
| `src/stores/cartStore.js` | 增强 Action 的健壮性，减少组件直接操作内部 state | 确保 UI 响应及时 |

## 7. 实施步骤与测试建议
### 实施步骤
1. **创建 Composables**: 在 `src/composables/` 下创建相关文件。
2. **重构核心组件**: 修改 `XtxSku` 为 `<script setup>`。
3. **逐步替换页面逻辑**: 先从 Home 开始，再到 Detail，最后是 Cart。
4. **Lint 校验**: 每一步完成后运行 `npm run lint` 确保符合 AGENTS.md 规范。

### 测试建议
- **回归测试**: 重构后重点检查商品选择（SKU）、加入购物车、全选/反选功能是否正常。
- **性能监控**: 观察是否有重复请求（特别是 watchEffect/onMounted 中的逻辑）。
- **边界情况**: 测试无库存商品、未登录状态下的购物车操作。

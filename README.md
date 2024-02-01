# OOMOL Studio Home

OOMOL Studio Home Window.

## 安装

```bash
pnpm i
```

## 开发

- `pnpm run server` 开启 nodejs server 模块，支持调用 home-service 在 nodejs 的实现（部分使用 electron 的模块不会被注入）。
- `pnpm dev` 启动 vite 开发整个 studio home。
- `pnpm storybook` 启动 storybook 开发组件。

## 项目结构

`./packages/studio-home` 已配置便捷路径，代码使用 `~/` 代替 `/src/`。

### 入口

- `~/main.ts` 构建打包入口。
- `dev/main.tsx` vite 开发入口。

### 路由

- 地址配置 `~/routes/constants.ts`
- 路由组件配置 `~/routes/index.tsx`
- 页面组件放置于 `~/routes/*/index.tsx`

### i18n

- 方言文件 `~/locales/*.json`
- 使用翻译

  ```ts
  import { useTranslate } from "val-i18n-react";

  const t = useTranslate();
  ```

### 对外（oomol studio）接口

（参考 `~/routes/Home/index.tsx`）

1. 页面组件导出 `export interface AppContext {}` 声明需要的接口。
2. 如第一次为此页面配置，在 `~/routes/index.tsx` 中 `import` 并添加此类型 `export type AppContext = HomeAppContext & MyPageAppContext & ...;`。
3. 在页面组件使用 `useAppContext` 拿到需要的接口，如 `const { getOoProjects } = useAppContext();`
4. 在 `dev/main.tsx` 加上相应接口的假实现以便预览效果。

### 样式

- CSS 变量配置 `~/components/ThemeProvider/theme.scss`

### 连接到 [oomol studio](https://github.com/oomol/oomol-studio) 开发。

```shell
# 将相关项目 pnpm --global link
pnpm link2global

# 将相关项目 pnpm --global remove XXX
pnpm unlink2global
```

在连接之后，还需要修改 `packages/studio-home/package.json` 的内容，临时在根的第一级加入如下内容。以让 oomol-studio 通过编译。

```json
"exports": {
  ".": {
    "import": "./dist/main.js",
    "require": "./dist/main.cjs"
    },
  "./dist/style.css": "./dist/style.css"
},
```

### 工具方法

- 工具 React Hooks 统一由 `~/hooks` 导出使用。
- 其它工具类方法可以放到 `~/misc/` 下。

# --- Build stage ---
FROM node:22.18.0-alpine3.22 AS build

# 拉取 git 依赖必需；如有原生模块再加 python3 make g++
RUN apk add --no-cache git

WORKDIR /app

# 先拷贝依赖清单利用缓存
COPY package.json yarn.lock ./

# 拷贝 Yarn Modern 配置文件和目录
COPY .yarnrc.yml ./
COPY .yarn/ ./.yarn/

RUN corepack enable
RUN yarn install --frozen-lockfile

# 再拷贝源码并构建
COPY . .
RUN yarn build

# --- Runtime stage ---
FROM nginx:1.24-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

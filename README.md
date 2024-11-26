<!--
 * @Author: chenzihan
 * @Date: 2021-11-26 09:07:55
 * @LastEditTime: 2022-10-09 10:15:09
 * @LastEditors: chenzihan
 * @Description:
 * @FilePath: \colorExtraction-demo\README.md
-->

# color-extraction

图片取色器

#### 安装依赖

`pnpm install`

#### 本地启动服务

`pnpm run dev`

#### 文件打包

`pnpm run build`

#### 代码文件

`src/`

#### 打包文件

`dist/`

#### docker部署

构建镜像：
`docker build -t color-extraction:latest .`

运行容器：
`docker run -itd --restart always -e TZ=Asia/Shanghai -p 8060:80 --name color-extraction color-extraction:latest`
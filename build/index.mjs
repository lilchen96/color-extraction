/*
 * @Author: chenzihan
 * @Date: 2022-09-30 11:32:25
 * @LastEditTime: 2022-10-09 09:58:05
 * @LastEditors: chenzihan
 * @Description:
 * @FilePath: \colorExtraction-demo\build\index.mjs
 */
import fs, { unlink, copyFile, writeFile, readFileSync } from "fs";
import path from "path";
import { promisify } from "util";
import { execSync } from "child_process";
import CleanCSS from "clean-css";
const cleanCSS = new CleanCSS();

const unlinkPromisify = promisify(unlink);
const copyFilePromisify = promisify(copyFile);
const writeFilePromisify = promisify(writeFile);

const srcPath = path.resolve(process.cwd(), "src");
const distPath = path.resolve(process.cwd(), "dist");
const isDistExist = fs.existsSync(distPath);
if (isDistExist) {
  await deleteDir(distPath);
} else {
  fs.mkdirSync(distPath);
}
const files = fs.readdirSync(srcPath);
await buildDist(files);
console.log("build success!");

function deleteDir(dirPath) {
  const files = fs.readdirSync(distPath);
  return Promise.all(
    files.map((item) => unlinkPromisify(path.resolve(distPath, item)))
  );
}

function compressJSFile(path) {
  const stdout = execSync(`npx uglifyjs "${path}" --compress --mangle`, {
    encoding: "utf-8",
  });
  return stdout;
}

function compressCSSFile(path) {
  const content = readFileSync(path, { encoding: "utf-8" });
  return cleanCSS.minify(content).styles;
}

function buildDist(files) {
  return Promise.all(
    files.map((item) => {
      if (/.js$/i.test(item)) {
        return writeFilePromisify(
          path.resolve(distPath, item),
          compressJSFile(path.resolve(srcPath, item))
        );
      } else if (/.css$/i.test(item)) {
        return writeFilePromisify(
          path.resolve(distPath, item),
          compressCSSFile(path.resolve(srcPath, item))
        );
      } else {
        return copyFilePromisify(
          path.resolve(srcPath, item),
          path.resolve(distPath, item)
        );
      }
    })
  );
}

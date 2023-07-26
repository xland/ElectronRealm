let esbuild = require("esbuild");
/**
 *  编译主进程代码
 */
let buildMain = async ()=>{    
    await esbuild.build({
        entryPoints: ["./main/index.ts"],
        bundle: true,
        platform: 'node',  //为了引入Node内置库
        outfile: './build/main.js',
        external:["electron"] //排除掉Electron，为了引入Electron得内置库
        })
}
/**
 * 编译渲染进程得JS和HTML
 */
let buildRender = async ()=>{
    await esbuild.build({
        entryPoints: ["./render/index.ts"],
        bundle: true,
        platform: 'node',  //为了引入Node内置库
        outfile: './build/index.js',
        external:["electron"] //排除掉Electron，为了引入Electron得内置库
    })
    let fs = require("fs").promises
    const { minify } = require('html-minifier-terser');
    let html = await fs.readFile("./render/index.html")
    html = await minify(html.toString(),{removeComments:true,collapseWhitespace:true});
    await fs.writeFile("./build/index.html",html);
}
/**
 * 启动Electron
 */
let startElectron = async ()=>{
    let electron = require("electron")
    let spawn = require("child_process").spawn;
    let child = spawn(electron,["main.js"],{
        cwd:"./build"
    })
    child.stdout.on('data', (data) => {
        console.log(data.toString("utf8"));
    });
    child.on("close", () => {
        process.exit();
      });
}
/**
 * 开始编译
 */
let start = async ()=>{
    await buildMain();
    await buildRender();
    await startElectron();
}

start();
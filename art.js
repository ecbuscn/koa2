const Koa = require('koa');
const router = require('koa-router')();
const render = require('koa-art-template');
const serve = require('koa-static');
const  path = require("path");
const session = require('koa-session');

const app = new Koa();
app.use(serve('.'));

//配置session中间件
app.keys = ['shanghai90'];  //签名
const CONFIG = {
    key: 'koa.shanghai90', //签名
    maxAge: 86400000,   //过期时间
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    secure: false,
    sameSite: null,
};
//启用session中间件
app.use(session(CONFIG,app));


render(app, {
    root: path.join(__dirname, 'views'),    //视图的位置
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'//是否开启调试模式
});



//配置路由
router.get("/",async (ctx)=>{
    ctx.session.userinfo="zhang";
    ctx.session.userid="26";
    let title="你好呀";
    let list={
        "name":"zhang",
        "age":26
    }
    await ctx.render('index',{
        title:title,
        list:list
    })
})

router.get("/login",async (ctx)=>{
   let sessionData=ctx.session.userinfo;
   let sessionDataUserid=ctx.session.userid;

    await ctx.render('login',{
        sessionData:sessionData,
        sessionDataUserid:sessionDataUserid
    })
})

app.use(router.routes()); //启动路由
app.use(router.allowedMethods()); // 作用： 这是官方文档的推荐用法,我们可以

app.listen(8080);

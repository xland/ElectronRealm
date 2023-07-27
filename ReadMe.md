1. 环境搭建
    1. Electron(主进程、渲染进程)
    1. realm
1. 主进程
    主进程使用realm
1. 渲染进程
    渲染进程使用realm
1. 多进程
    1个主进程多个渲染进程同时使用realm
1. realm数据文件加密


成果：
- 程序被强制退出，未关闭数据库，不会损坏数据文件。
- 使用A密码创建的数据库，使用B密码无法打开
- 单表批量插入1万行数据 300-400ms；单表模糊查询1-2ms
- 单表批量插入30万行数据 10000-15000ms；单表模糊查询15-500ms；数据库大小75M-80M
- 30W数据，多条件+模糊查询15-500ms；
- 主进程，渲染进程共用数据库，查询无问题。
- **多进程并发写入数据有问题**//The realm is already in a write transaction
- **跨进程数据通知有问题** //A进程更新的数据无法通知到B进程
- **主进程执行写入任务时，不能完成其他任务**  //不要加载渲染进程后，就让主进程做繁重的任务

需要关注的内容：
- 不要在一个渲染进程中创建多个数据库连接对象



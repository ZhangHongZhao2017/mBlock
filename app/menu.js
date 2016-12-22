/**
 * 菜单管理
 */
const{Menu,dialog} = require('electron');
const events = require('events');
const instructions = require('./instructions');
var _emitter = new events.EventEmitter();  
var _app,_mainMenu,_stage,_translator,_serial,_hid,_project;
function AppMenu(app){
    var self = this;
    _app = app;
    _stage = _app.getStage();
    _translator = _app.getTranslator();
    _serial = _app.getSerial();
    _project = _app.getProject();
    _hid = _app.getHID();
    this.reset = function (){
        if(!_translator){
            return;
        }
        const _menu = [
            {
                name:'File',
                label: _translator.map("File"),
                submenu: [
                    {
                        name:'New',
                        label: _translator.map('New Project'),
                        accelerator: 'CmdOrCtrl+N',
                        click: function (item, focusedWindow) {
                            _emitter.emit("newProject");
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        name:'Load Project',
                        label: _translator.map('Load Project'),
                        accelerator: 'CmdOrCtrl+O',
                        click: function (item, focusedWindow) {
                            dialog.showOpenDialog({title:"打开项目",properties: ['openFile'],filters: [{ name: 'Scratch', extensions: ['sb2'] }  ]},function(path){
                                if(path&&path.length>0){
                                    _project.openProject(path[0]);
                                }
                            })
                        }
                    },
                    {
                        name:'Save Project',
                        label: _translator.map('Save Project'),
                        accelerator: 'CmdOrCtrl+S',
                        click: function (item, focusedWindow) {
                            _emitter.emit("saveProject");
                        }
                    },
                    {
                        name:'Save Project As',
                        label: _translator.map('Save Project As'),
                        accelerator: 'CmdOrCtrl+Alt+S',
                        click: function (item, focusedWindow) {
                            _emitter.emit("saveProjectAs");
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        name:'Import Image',
                        label: _translator.map('Import Image')
                    },
                    {
                        name:'Export Image',
                        label: _translator.map('Export Image')
                    },
                    {
                        type: 'separator'
                    },
                    {
                        name:'Undo Revert',
                        label: _translator.map('Undo Revert')
                    },
                    {
                        name:'Revert',
                        label: _translator.map('Revert')
                    }
                ]
            },{
                name:'Edit',
                label: '编辑',
                submenu: [
                    {
                        name:'Undelete',
                        label: '撤销删除',
                        click: function (item, focusedWindow) {
                            _stage.undelete();
                        }
                    },
                    {
                        type: 'separator'
                    },
                    {
                        name:'Hide Stage',
                        label: '隐藏舞台',
                        type:"checkbox",
                        checked:_stage.isStageMode("hide stage layout"),
                        click: function (item, focusedWindow) {
                            _stage.changeStageMode("hide stage layout");
                        }
                    },
                    {
                        name:'Small stage layout',
                        label: '小舞台布局模式',
                        type:"checkbox",
                        checked:_stage.isStageMode("small stage layout"),
                        click: function (item, focusedWindow) {
                            _stage.changeStageMode("small stage layout");
                        }
                    },
                    {
                        name:'Turbo mode',
                        label: '加速模式',
                        type:"checkbox",
                        checked:_stage.isStageMode("turbo mode"),
                        click: function (item, focusedWindow) {
                            _stage.changeStageMode("turbo mode");
                        }
                    },
                    {
                        name:'Arduino mode',
                        label: 'Arduino模式',
                        type:"checkbox",
                        checked:_stage.isStageMode("arduino mode"),
                        click: function (item, focusedWindow) {
                            _stage.changeStageMode("arduino mode");
                        }
                    }
                ]
            },{
                name:'Connect',
                label: '连接',
                submenu: [
                    {
                        name:'Serial Port',
                        label: '串口',
                        submenu: [
                            {
                                type: 'separator'
                            },{
                            name:'Refresh',
                            label: '刷新串口',
                            click:function (item, focusedWindow) {
                                self.updateSerialPort();
                            }
                        }]
                    },
                    {
                        name:'Bluetooth',
                        label: '蓝牙',
                        submenu: [
                            {
                                name:"Discover",
                                label:"发现"
                            },
                            {
                                type:"separator"
                            },
                            {
                                name:"Clear Bluetooth",
                                label:"清除记录"
                            }
                        ]
                    },
                    {
                        name:'2.4G Serial',
                        label: '2.4G无线串口',
                        submenu: [
                            {
                                name:"Connect",
                                label:"连接",
                                type:"checkbox",
                                checked:_hid.isConnected(),
                                click: function (item, focusedWindow) {
                                    _hid.connect();
                                }
                            }
                        ]
                    },
                    {
                        type:"separator"
                    },
                    {
                        name: 'Set firmware mode',
                        label: _translator.map('Set firmware mode'),
                        submenu:[
                            {
                                name:'Bluetooth mode',
                                label: _translator.map('Bluetooth mode'),
                                enabled: _serial.isConnected() && _boards.selected("me/auriga_mega2560"),
                                click:function (item, focusedWindow) {
                                    if(_serial.isConnected()){
                                        _serial.send(instructions.auriga.bluetooth_model);
                                    }
                                }
                            },
                            {
                                name: 'Ultrasonic obstacle avoidance mode',
                                label: _translator.map('Ultrasonic obstacle avoidance mode'),
                                enabled: _serial.isConnected() && _boards.selected("me/auriga_mega2560"),
                                click:function (item, focusedWindow) {
                                    if(_serial.isConnected()){
                                        _serial.send(instructions.auriga.ultrasonic_obstacle_avoidance_mode);
                                    }
                                }
                            },
                            {
                                name: 'Find line mode',
                                label: _translator.map('Find line mode'),
                                enabled: _serial.isConnected() && _boards.selected("me/auriga_mega2560"),
                                click:function (item, focusedWindow) {
                                    if(_serial.isConnected()){
                                        _serial.send(instructions.auriga.find_line_mode);
                                    }
                                }
                            },
                            {
                                name: 'Self balanced model',
                                label: _translator.map('Self balanced model'),
                                enabled: _serial.isConnected() && _boards.selected("me/auriga_mega2560"),
                                click:function (item, focusedWindow) {
                                    if(_serial.isConnected()){
                                        _serial.send(instructions.auriga.self_balanced_model);
                                    }
                                }
                            }
                        ]
                    },
                    {
                        name:'View Source',
                        label: '查看源码'
                    },
                    {
                        name:'Install Arduino Driver',
                        label: '安装Arduino驱动'
                    }
                ]
            },{
                name:'Boards',
                label: '控制板',
                submenu: [
                    {
                        name:"Arduino",
                        label:"Arduino",
                        enabled:false
                    },
                    {
                        name:"arduino_uno",
                        label:"Arduino Uno",
                        type:"checkbox",
                        checked:_boards.selected("arduino_uno"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"arduino_leonardo",
                        label:"Arduino Leonardo",
                        type:"checkbox",
                        checked:_boards.selected("arduino_leonardo"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"arduino_nano328",
                        label:"Arduino Nano ( mega328 )",
                        type:"checkbox",
                        checked:_boards.selected("arduino_nano328"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"arduino_mega1280",
                        label:"Arduino Mega 1280",
                        type:"checkbox",
                        checked:_boards.selected("arduino_mega1280"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"arduino_mega2560",
                        label:"Arduino Mega 2560",
                        type:"checkbox",
                        checked:_boards.selected("arduino_mega2560"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        type:"separator"
                    },
                    {
                        name:"Makeblock",
                        label:"Makeblock",
                        enabled:false
                    },
                    {
                        name:"me/orion_uno",
                        label:"Starter/Ultimate (Orion)",
                        type:"checkbox",
                        checked:_boards.selected("me/orion_uno"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"me/uno_shield_uno",
                        label:"Me Uno Shield",
                        type:"checkbox",
                        checked:_boards.selected("me/uno_shield_uno"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"me/mbot_uno",
                        label:"mBot (mCore)",
                        type:"checkbox",
                        checked:_boards.selected("me/mbot_uno"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"me/auriga_mega2560",
                        label:"mBot Ranger (Auriga)",
                        type:"checkbox",
                        checked:_boards.selected("me/auriga_mega2560"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        name:"me/mega_pi_mega2560",
                        label:"Ultimate 2.0 (Mega Pi)",
                        type:"checkbox",
                        checked:_boards.selected("me/mega_pi_mega2560"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    },
                    {
                        type:"separator"
                    },
                    {
                        name:"Others",
                        label:"Others",
                        enabled:false
                    },
                    {
                        name:"picoboard_unknown",
                        label:"PicoBoard",
                        type:"checkbox",
                        checked:_boards.selected("picoboard_unknown"),
                        click:function(item, focusedWindow){
                            _boards.selectBoard(item.name);
                        }
                    }
                ]
            },{
                name:'Extensions',
                label: '扩展',
                submenu: [
                    {
                        name:'Manage Extensions',
                        label: '管理扩展',
                        click: function (item, focusedWindow) {
                            
                        }
                    },
                    {
                        name:'Restore Extensions',
                        label: '检查最新扩展',
                        click: function (item, focusedWindow) {
                            
                        }
                    },
                    {
                        name:'Clear Cache',
                        label: '清空缓存',
                        click: function (item, focusedWindow) {
                            
                        }
                    },
                    {
                        type:"separator"
                    },
                    {
                        name:'Microsoft Cognitive Service Setting',
                        label: 'Microsoft Cognitive Service Setting',
                        click: function (item, focusedWindow) {
                            
                        }
                    },
                    {
                        type:"separator"
                    }
                ]
            },{
                name:'Language',
                label: '语言',
                submenu: [
                    {
                        name:'set font size',
                        label: '设置字体大小',
                        submenu:[
                            {
                                name:"setFontSize",
                                label:"8",
                            },
                            {
                                name:"setFontSize",
                                label:"10",
                            },
                            {
                                name:"setFontSize",
                                label:"11",
                            },
                            {
                                name:"setFontSize",
                                label:"12",
                            },
                            {
                                name:"setFontSize",
                                label:"14",
                            },
                            {
                                name:"setFontSize",
                                label:"16",
                            },
                            {
                                name:"setFontSize",
                                label:"18",
                            },
                            {
                                name:"setFontSize",
                                label:"20",
                            },
                            {
                                name:"setFontSize",
                                label:"24",
                            }
                        ]
                    }
                ]
            },{
                name:'Help',
                label: '帮助',
                submenu: [
                    {
                        name:'Exploring Robotic World',
                        label: '探索机器人世界',
                        click: function (item, focusedWindow) {
                            _app.openURL("http://www.makeblock.com/?utm_source=software&utm_medium=mblock&utm_campaign=mblocktomakeblock");
                        }
                    },
                    {
                        type:"separator"
                    },
                    {
                        name:'Getting Started Rapidly',
                        label: '快速入门',
                        click: function (item, focusedWindow) {
                           _app.openURL("http://learn.makeblock.com/getting-started-programming-with-mblock?utm_source=software&utm_medium=mblock&utm_campaign=mblocktorumeng");
                        }
                    },
                    {
                        name:'Finding Answers Online',
                        label: '在线问答',
                        click: function (item, focusedWindow) {
                            _app.openURL(currentLocale=="zh-CN"?"http://bbs.makeblock.cc/forum-39-1.html?utm_source=software&utm_medium=mblock&utm_campaign=mblocktobbs":"http://forum.makeblock.cc/c/makeblock-products/mblock?utm_source=software&utm_medium=mblock&utm_campaign=mblocktoforum#scratch");
                        }
                    },
                    {
                        name:'Learn More Tutorials',
                        label: '浏览更多教程',
                        click: function (item, focusedWindow) {
                            _app.openURL("http://learn.makeblock.com/?utm_source=software&utm_medium=mblock&utm_campaign=mblocktolearn");
                        }
                    },
                    {
                        type:"separator"
                    },
                    {
                        name:'Check For Update',
                        label: '检查应用更新',
                        click: function (item, focusedWindow) {
                        }
                    },
                    {
                        name:'Feedback',
                        label: '报告错误',
                        click: function (item, focusedWindow) {
                        }
                    }
                ]
            }
        ];
        var template = _menu.concat([]);
        if (process.platform === 'darwin') {
            template.unshift({
                label: _app.getName(),
                submenu: [
                    {
                        role: 'about',
                        label:'About mBlock'
                    },
                    {
                        role: 'quit',
                        label:'Quit'
                    }
                ]
            })
        }
        _mainMenu = Menu.buildFromTemplate(template);
        var items = _translator.getMenuItems();
        for(var i=0;i<items.length;i++){
            var item = items[i];
            _mainMenu.items[process.platform === 'darwin'?6:5].submenu.insert(0,item);
        }
        items = _serial.getMenuItems();
        for(var i=0;i<items.length;i++){
            var item = items[i];
            _mainMenu.items[process.platform === 'darwin'?3:2].submenu.items[0].submenu.insert(0,item);
        }
    }
    this.selectBoard = function(item, focusedWindow){
        _boards.selectBoard(item.name);
        //self.update();
	}
    this.update = function(){
		self.reset();
        Menu.setApplicationMenu(_mainMenu);
    }
    this.on = function(event,listener){
        _emitter.removeListener(event,listener);
        _emitter.on(event,listener);
    }
}
module.exports = AppMenu;
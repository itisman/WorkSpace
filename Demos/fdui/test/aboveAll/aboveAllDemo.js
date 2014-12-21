/**
 * 基于一个增删改查的例子
 */

var grid;
var crudWin;
var formPanel;
var schPanel;

var GENDER_ITEMS = [{value:0,text:"女"},{value:1,text:"男"}];

var POLITICS_STATUS_ITEMS = [
	{value:0,text:"群众"}
	,{value:1,text:"共青团员"}
	,{value:2,text:"党员"}
	,{value:3,text:"预备党员"}
];


function init() {
	
	new FDTab({
		domId:'tabInfo'
		,items:[
			{text:'班级信息',contentId:'classInfo'}
			,{text:'学生管理',contentId:'studentManage',checked:true}
		]
	});
	
	schPanel = new FDFormPanel({
		controls:[
			new FDTextBox({domId:'schStuNo',name:'schStuNo',label:'学号：'})
			,new FDTextBox({domId:'schName',name:'schName',label:'姓名：'})
			,new FDCheckBox({domId:'schGender',name:'schGender',label:'性别：',defaultValue:[0,1],items:GENDER_ITEMS})
		]
	});
	
	// 搜索区按钮
	new FDButton({domId:'btnSch',text:'搜索',onclick:search});
	new FDButton({domId:'btnAdd',text:'添加',onclick:add});
	
	grid = new FDGrid({
		domId:'grid'
		// 如果有服务端的时候可以写url
		//,url:''
		// 本地数据
		,data:serverData
		,height:'200px'
		,columns:[
			{text:"学号",name:"stuNo",sortName:'stuNo'}
			,{text:"姓名",name:"name"}
			,{text:"性别",name:"gender",width:50,render:genderRender}
			,{text:"名族",name:"nationality"}
			,{text:"政治面貌",name:"politicsStatus",render:politicsRender}
			,{text:"出生日期",name:"birthday"}
			,{text:"联系电话",name:"mobile"}
			,{text:"联系地址",name:"address",width:150,render:addressRender}
			,{text:"入学时间",name:"registDate",sortName:'registDate'}
		]
		,actionButtons:[
			{text:'修改',onclick:update}
			,{text:'删除',onclick:del}
		]
		,sortName:'registDate'
		,sortOrder:'ASC'
	});
	
	crudWin = new FDWindow({
		domId:'crudWin'
		,title:'学生信息管理'
		,modal:false
		,buttons:[
			{text:'确定',onclick:function(){
				printData(formPanel.getValues());
				crudWin.close();
				//formPanel.save();
			}}
			,{text:'取消',onclick:function(){
				crudWin.hide();
			}}
		]
	});
	
	formPanel = new FDFormPanel({
		grid:grid
		,win:crudWin
		// 服务器端的请求
		,crudUrl:{
			add: '/addStudent.do'
			,update: '/updateStudent.do'
			,del: '/delStudent.do'
		}
		,controls:[
			new FDHidden({domId:'id',name:'id'})
			,new FDTextBox({domId:'stuNo',name:'stuNo',label:'学号：',
				validates:[new FDValidate({maxLength:10,label:'学号',notNull:true})]})
			,new FDTextBox({domId:'name',name:'name',label:'姓名：'})
			,new FDRadio({domId:'gender',name:'gender',label:'性别：',defaultValue:1,items:GENDER_ITEMS})
			,new FDTextBox({domId:'nationality',name:'nationality',label:'名族：'})
			,new FDSelectBox({domId:'politicsStatus',name:'politicsStatus',label:'政治面貌：',items:POLITICS_STATUS_ITEMS,
				validates:[new FDValidate({label:'政治面貌',notNull:true})]})
			,new FDTextArea({domId:'address',name:'address',label:'联系地址：'})
			,new FDDatePick({domId:'birthday',name:'birthday',label:'出生日期：'})
			,new FDTextBox({domId:'mobile',name:'mobile',label:'联系电话：'})
			,new FDDatePick({domId:'registDate',name:'registDate',label:'入学时间：'})
		]
	});
	
	new FDPanel({
		domId:'classDetail'
		,title:'班级信息'
		,isSlide:true
		,width:'300px'
		,height:'100px'
	});
}

function refresh() {
	grid.refresh();
}

function reload() {
	grid.reload();
}

function search() {
	printData(schPanel.getValues());
	//grid.search(schPanel.getValues());
}

function add() {
	formPanel.getControl('stuNo').enable();
	formPanel.add();
}

/**
 * 修改
 */
function update(rowData,rowIndex) {
	formPanel.update(rowData);
	// 禁用学号
	formPanel.getControl('stuNo').disable();
}

/**
 * 删除
 */
function del(rowData,rowIndex) {
	var name = rowData.name;
	FDWindow.confirm('确定删除' + name + '?',function(){
    	alert('成功删除');
    	crudWin.close();
	});
}

function politicsRender(rowData,td,rowIndex) {
	return POLITICS_STATUS_ITEMS[rowData.politicsStatus].text;
}

function genderRender(rowData,td,rowIndex) {
	return GENDER_ITEMS[rowData.gender].text;
}

function addressRender(rowData,td,rowIndex) {
	var address = rowData.address;
	var len = 14;
	if(address.length > len) {
		FDTipUtil.addTip(td,address);
		address = address.substring(0,len) + '...';
		return '<span>' + address + '</span>'
	}
	return address;
}

function printData(data) {
	var out = "";
	for(var key in data) {
		out += key + ':' + data[key] + '\n';
	}
	alert(out);
}

// ---------------------服务器端返回的数据-------------------------
var serverData = 
 {"pageIndex":1,"rows":[{"address":"北京市朝阳区广顺北大街33号院1号楼福码大厦","birthday":"","department":16,"gender":1,"id":6,"mobile":"13398761567","name":"张三","nationality":"汉族","politicsStatus":1,"registDate":"2010-02-16","stuNo":"NO000006"},{"address":"CN","birthday":"2012-10-17","department":16,"gender":1,"id":1,"mobile":"13398761567","name":"张三","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":21,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":22,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":23,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"2012-10-01","department":16,"gender":1,"id":24,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"2012-10-12","department":17,"gender":1,"id":25,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"2012-10-18","department":16,"gender":1,"id":26,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":2,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"2012-10-19","department":18,"gender":1,"id":27,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":30,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"2012-10-16","department":20,"gender":1,"id":31,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":32,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":33,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":34,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"2012-10-27","department":20,"gender":1,"id":35,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"USA","birthday":"","department":16,"gender":1,"id":20,"mobile":"13398761567","name":"JIM","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000001"},{"address":"北京市朝阳区广顺北大街33号院1号楼福码大厦","birthday":"2012-10-05","department":16,"gender":1,"id":8,"mobile":"13398761567","name":"张三1","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO0000011"},{"address":"北京市朝阳区广顺北大街33号院1号楼福码大厦","birthday":"2012-10-19","department":16,"gender":1,"id":4,"mobile":"13398761567","name":"张三","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO000004"},{"address":"北京市朝阳区广顺北大街33号院1号楼福码大厦","birthday":"","department":16,"gender":0,"id":5,"mobile":"13398761567","name":"张三","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO000005"},{"address":"北京市朝阳区广顺北大街33号院1号楼福码大厦","birthday":"","department":16,"gender":1,"id":2,"mobile":"13398761567","name":"张三","nationality":"汉族","politicsStatus":1,"registDate":"2011-12-02","stuNo":"NO000002"}],"total":33} 
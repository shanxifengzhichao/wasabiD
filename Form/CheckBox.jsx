/**
 * Created by zhiyongwang on 2016-04-05以后.
 * 复选框集合组件
 */
require("../Sass/Form/Check.scss");
let React=require("react");
let unit=require("../libs/unit.js");
var FetchModel=require("../Model/FetchModel.js");
var validation=require("../Lang/validation.js");
let setStyle=require("../Mixins/setStyle.js");
var validate=require("../Mixins/validate.js");
var LinkButton=require("../Buttons/LinkButton.jsx");
var showUpdate=require("../Mixins/showUpdate.js");
var shouldComponentUpdate=require("../Mixins/shouldComponentUpdate.js");
var Label=require("../Unit/Label.jsx");
var Message=require("../Unit/Message.jsx");
let CheckBox=React.createClass({
    mixins:[setStyle,validate,showUpdate,shouldComponentUpdate],
    PropTypes:{
        name:React.PropTypes.string.isRequired,//字段名
        label:React.PropTypes.oneOfType([React.PropTypes.string,React.PropTypes.object,React.PropTypes.element,React.PropTypes.node]),//字段文字说明属性
        title:React.PropTypes.string,//提示信息
        width:React.PropTypes.number,//宽度
        height:React.PropTypes.number,//高度
        value:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//默认值,
        text:React.PropTypes.oneOfType([React.PropTypes.number,React.PropTypes.string]),//默认文本值
        placeholder:React.PropTypes.string,//输入框预留文字
        readonly:React.PropTypes.bool,//是否只读
        required:React.PropTypes.bool,//是否必填
        onlyline:React.PropTypes.bool,//是否只占一行
        hide:React.PropTypes.bool,//是否隐藏
        regexp:React.PropTypes.string,//正则表达式
        invalidTip:React.PropTypes.string,//无效时的提示字符
        style:React.PropTypes.object,//自定义style
        className:React.PropTypes.string,//自定义class
        type:React.PropTypes.oneOf([
            "checkbox",
            "checkbtn",
        ]),//显示的样式
        size:React.PropTypes.oneOf([
            "none",
            "default",
            "large",//兼容性值,与two相同
            "two",
            "three",
            "onlyline"
        ]),//组件表单的大小
        position:React.PropTypes.oneOf([
            "left",
            "default",
            "right"
        ]),//组件在表单一行中的位置
        //其他属性
        min:React.PropTypes.number,//最少选择几个
        max:React.PropTypes.number,//最多选择几个

        //其他属性
        valueField: React.PropTypes.string,//数据字段值名称
        textField:React.PropTypes.string,//数据字段文本名称
        url:React.PropTypes.string,//ajax的后台地址
        params:React.PropTypes.object,//查询参数
        dataSource:React.PropTypes.string,//ajax的返回的数据源中哪个属性作为数据源,为null时直接后台返回的数据作为数据源
        data:React.PropTypes.array,//自定义数据源
        extraData:React.PropTypes.array,//额外的数据,对url有效
        onSelect: React.PropTypes.func,//选中后的事件，回传，value,与text,data


    },
    getDefaultProps:function() {
        return{
            name:"",
            label:null,
            title:null,
            width:null,
            height:null,
            value:"",
            text:"",
            placeholder:"",
            readonly:false,
            required:false,
            onlyline:false,
            hide:false,
            regexp:null,
            invalidTip:null,
            style:null,
            className:null,
            size:"default",
            position:"default",
            //其他属性
            min:null,
            max:null,
            //其他属性
            valueField:"value",
            textField:"text",
            url:null,
            params:null,
            dataSource:"data",
            data:null,
            extraData:null,
            onSelect:null,
            type:"checkbox",
        };
    },
    getInitialState:function() {
        var newData=[];var text=this.props.text;
        if(this.props.data instanceof Array)
        {
            for(let i=0;i<this.props.data.length;i++)
            {
                let obj=this.props.data[i];
                obj.text=this.props.data[i][this.props.textField];
                obj.value=this.props.data[i][this.props.valueField];
                if(obj.value==this.props.value)
                {
                    text=obj.text;//根据value赋值
                }
                newData.push(obj);
            }
        }

        return {
            hide:this.props.hide,
            min:this.props.min,
            max:this.props.max,
            params:unit.clone(this.props.params),//参数
            data:newData,
            value:this.props.value,
            text:text,
            ulShow:false,//是否显示下拉选项
            readonly:this.props.readonly,

            //验证
            required:this.props.required,
            validateClass:"",//验证的样式
            helpShow:"none",//提示信息是否显示
            helpTip:validation["required"],//提示信息
            invalidTip:"",
        }
    },
    componentWillReceiveProps:function(nextProps) {
        var newData=[];var text=nextProps.text;
        if(nextProps.data!=null&&nextProps.data instanceof  Array &&(!nextProps.url||nextProps.url=="")) {

            for(let i=0;i<nextProps.data.length;i++)
            {
                let obj=nextProps.data[i];
                obj.text=nextProps.data[i][this.props.textField];
                obj.value=nextProps.data[i][this.props.valueField];
                if(obj.value==nextProps.value)
                {
                    text=obj.text;//根据value赋值
                }
                newData.push(obj);
            }
            this.setState({
                hide:nextProps.hide,
                data:newData,
                min:nextProps.min,
                max:nextProps.max,
                value:nextProps.value,
                text: text,
                params:unit.clone( nextProps.params),
                readonly:nextProps.readonly,
                required:nextProps.required,
                validateClass:"",//重置验证样式
                helpTip:validation["required"],//提示信息
            })
        }
        else {


            if(nextProps.url!=null) {

                if(this.showUpdate(nextProps.params))
                {//如果不相同则更新
                    this.loadData(nextProps.url,nextProps.params);
                }
                else
                {

                }
            }

            this.setState({
                hide:nextProps.hide,
                min:nextProps.min,
                max:nextProps.max,
                 value:nextProps.value,
                 text: text,
                params:unit.clone( nextProps.params),
                readonly:nextProps.readonly,
                required:nextProps.required,
                validateClass:"",//重置验证样式
                helpTip:validation["required"],//提示信息
            })

        }
    },
    componentWillMount:function() {//如果指定url,先查询数据再绑定
        this.loadData(this.props.url,this.state.params);//查询数据
    },
    loadData:function(url,params) {

        if(url!=null&&url!="")
        {
            if(params==null)
            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,null,this.loadError);

                unit.fetch.get(fetchmodel);
            }
            else

            {
                var fetchmodel=new FetchModel(url,this.loadSuccess,params,this.loadError);

                unit.fetch.post(fetchmodel);
            }
        }
    },
    loadError:function(errorCode,message) {//查询失败
        Message. error(message);
    },
    loadSuccess:function(data) {//数据加载成功
        var realData=data;
        if(this.props.dataSource==null) {
        }
        else {
            realData=unit.getSource(data,this.props.dataSource);
        }
        var newData=[];var text=this.state.text;
        for(let i=0;i<realData.length;i++)
        {
            let obj=realData[i];//将所有字段添加进来
            obj.text=realData[i][this.props.textField];
            obj.value=realData[i][this.props.valueField];
            if(obj.value==this.state.value)
            {
                text=obj.text;//根据value赋值
            }
            newData.push(obj);
        }
        if(this.props.extraData==null||this.props.extraData.length==0)
        {
            //没有额外的数据
        }
        else
        {
            //有额外的数据
            for(let i=0;i<this.props.extraData.length;i++)
            {
                let obj={};
                obj.text=this.props.extraData[i][this.props.textField];
                obj.value=this.props.extraData[i][this.props.valueField];
                if(obj.value==this.state.value)
                {
                    text=obj.text;//根据value赋值
                }
                newData.unshift(obj);
            }
        }
        window.localStorage.setItem(this.props.name+'data' ,JSON.stringify(newData));//用于后期获取所有数据

        this.setState({
            data:newData,
            value:this.state.value,
            text:text,
        })
    },
    changeHandler:function(event) {//一害绑定，但不处理
        if(this.state.readonly) {
            event.preventDefault();
        }
    },
    onSelect:function(value,text,data,e) {//选中事件
e.preventDefault();//因为有用户借助label属性生成新的checkbox,所以要阻止默认事件
        if(this.state.readonly) {
            return ;
        }
        var newvalue="";var newtext="";

        var oldvalue =[];
        var oldtext =[];
        if(this.state.value)
        {
            oldvalue=this.state.value.toString().split(",");
            oldtext=this.state.text.toString().split(",");
        }
        if (oldvalue.indexOf(value.toString()) > -1) {//取消选中
            oldvalue.splice(oldvalue.indexOf(value.toString()),1);
            oldtext.splice(oldvalue.indexOf(value.toString()),1);
            newvalue=oldvalue.join(",");
            newtext=oldtext.join(",");
        }
        else {//选中
            if(this.state.value&&value!="")
            {
                newvalue = this.state.value + "," + value;
                newtext = this.state.text + "," + text;
            }
            else
            {
                newvalue = value;
                newtext =  text;
            }

        }
        this.setState({
            value:newvalue,
            text:newtext,
        });

        this.validate(newvalue);
        if( this.props.onSelect!=null) {
          this.props.onSelect(newvalue,newtext,this.props.name,data);
        }
    },
    render:function() {
        var size=this.props.onlyline==true?"onlyline":this.props.size;//组件大小
        var componentClassName=  "wasabi-form-group "+size+" "+(this.props.className?this.props.className:"");//组件的基本样式
        var style =this.setStyle("input");//设置样式
        var controlStyle=this.props.controlStyle?this.props.controlStyle:{};
        controlStyle.display = this.state.hide == true ? "none" : "block";
        var control=null;
        if(this.state.data instanceof  Array) {
            control= this.state.data.map((child, i)=> {
                var checked=false;
                if((this.state.value!==null&&this.state.value!==undefined)&&((","+this.state.value.toString()+",").indexOf(","+child[this.props.valueField]+",")>-1))
                {
                    checked=true;
                }
                var props={
                    checked:(checked==true?"checked":null),//是否为选中状态
                    readOnly:this.state.readonly==true?"readonly":null,
                }
             if(this.props.type=="checkbox"){
                 return  (
                     <li key={i} onClick={this.onSelect.bind(this,child.value,child.text,child)}  >
                         <input type="checkbox"  id={"checkbox"+this.props.name+child.value}  value={child.value}
                                onChange={this.changeHandler} className="checkbox"  {...props}></input>
                         <label className="checkbox-label"  {...props}></label>
                         <div  className="checktext" >{child.text}</div>
                     </li >
                 )
             }else if(this.props.type=="checkbtn"){
                 return  (
                     <li className="checkbtn-wrap" key={i} onClick={this.onSelect.bind(this,child.value,child.text,child)}  >
                         <input type="checkbox"  id={"checkbox"+this.props.name+child.value}  value={child.value}
                                onChange={this.changeHandler} className="checkbox"  {...props}></input>
                         <LinkButton
                             {...props}
                             className={checked==true?"checkbox-linkBtn checkbox-linkBtn-active":"checkbox-linkBtn"}
                             name={this.props.name}
                             title={child.text}
                             iconCls={checked==true?"icon-select":"no"}/>
                     </li >
                 )
             }
            });

        }
        return (

        <div className={componentClassName+this.state.validateClass} style={ controlStyle}>
            <Label name={this.props.label} hide={this.state.hide} required={this.state.required}></Label>
            <div className={ "wasabi-form-group-body"} style={{width:!this.props.label?"100%":null}}>
                <ul className="wasabi-checkul">
                    {
                        control
                    }
                </ul>
                <small className={"wasabi-help-block "+this.props.position} style={{display:(this.state.helpTip&&this.state.helpTip!="")?this.state.helpShow:"none"}}><div className="text">{this.state.helpTip}</div></small>
            </div>
        </div>

        )

    }

});
module.exports=CheckBox;
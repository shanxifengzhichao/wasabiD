/**
 * Created by zhiyongwang on 2016-02-24.
 * 列表表头模型
 */
 var EditorModel=require("./EditorModel");
class HeaderModel {
    constructor(name,label,content=null,hide=false,sortAble=false,width=null,fixed=null)
    {
        this.name=name;
        this.label=label;
        this.content=content;
        this.hide=hide;
        this.sortAble=sortAble;
        this.width=width;
        this.fixed=fixed;//fixedLeft or fixedRight  当前列是否固定在左侧 or 右侧
        this.align="left";
        this.rowspan=null;//表头占几行
        this.colspan=null;//表头占几列
        this.editor=null;//处理编辑时的,默认为文本
    }
}
module .exports=HeaderModel;
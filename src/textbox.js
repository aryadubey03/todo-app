import './App';
import { useState } from "react";

function List({value,onClickCheck,onDelete}){
    return(
        <>
        <div class="list" id="tobedone">
            <div class="textspace">{value}</div>
            <button class="checkbox" onClick={onClickCheck}>{'\u2705'}</button>
            <button class="delete" onClick={onDelete}>{'\u{1F5D1}'}</button>
        </div>
        </>
    );

}

function Completed({value,onClickRemove,onDeleteCompleted}){
    return(
        <div class="list" id="completed">
            <div class="textspace">{value}</div>
            <button class="checkbox" onClick={onClickRemove}>{'\u{1F501}'}</button>
            <button class="delete" onClick={onDeleteCompleted}>{'\u{1F5D1}'}</button>
        </div>
    );
}

function TextBox(){
    const [showList, changeList]=useState([]);
    const [showvalue,changeValue]=useState("");
    const [showCompleted,changeCompleted]=useState([]);

    const onClickCheck=(index)=>{
        changeCompleted([...showCompleted,showList[index]]);
        changeList(showList.filter((_,val)=>val!=index));
    }

    const onClickRemove=(index)=>{
        changeList([...showList,showCompleted[index]]);
        changeCompleted(showCompleted.filter((_,val)=>val!=index));
    }

    const onDelete=(index)=>{
        changeList(showList.filter((_,val)=>val!=index));
    }

    const onDeleteCompleted=(index)=>{
        changeCompleted(showCompleted.filter((_,val)=>val!=index));
    }

    const onChangeValue=(e)=>{
            changeValue(e.target.value)
        }

    const onSubmitButton=(e)=>{
        e.preventDefault();
        if(showvalue==""){
            alert("Please specify a value")
            return
        }
        changeList([...showList, showvalue])
        changeValue("")
    } 

    return(
        <>
        <div>
            <form onSubmit={onSubmitButton}>
            <input type="Text" class="input" id="inputbox" onChange={onChangeValue} value={showvalue}></input>
            <input type="submit" class="input" id="submit" value="ADD"></input>
            </form>
            <div class="listbox">
            {showList.map((showValue,index)=>(
                <List 
                    key={index}
                    value={showValue}
                    onClickCheck={()=>onClickCheck(index)}
                    onDelete={()=>onDelete(index)}
                />
            ))}
            {showCompleted.length>0 && <div id="completetitle">COMPLETED {'\u2705'}</div>}
            {showCompleted.map((val,index)=>(
                    <Completed
                        key={index}
                        value={val}
                        onClickRemove={()=>onClickRemove(index)}
                        onDeleteCompleted={()=>onDeleteCompleted(index)}
                    />
                )
                )
            }
            </div>
        </div>
        </>
    );
}

export default TextBox;
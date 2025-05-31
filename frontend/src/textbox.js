import './App';
import { useEffect, useState } from "react";

function List({ value, onClickCheck, onDelete }) {
    return (
        <>
            <div class="list" id="tobedone">
                <div class="textspace">{value}</div>
                <button class="checkbox" onClick={onClickCheck}>{'\u2705'}</button>
                <button class="delete" onClick={onDelete}>{'\u{1F5D1}'}</button>
            </div>
        </>
    );

}

function Completed({ value, onClickRemove, onDeleteCompleted }) {
    return (
        <div class="list" id="completed">
            <div class="textspace">{value}</div>
            <button class="checkbox" onClick={onClickRemove}>{'\u{1F501}'}</button>
            <button class="delete" onClick={onDeleteCompleted}>{'\u{1F5D1}'}</button>
        </div>
    );
}

function TextBox({ listname }) {
    const [showList, changeList] = useState([]);
    const [showvalue, changeValue] = useState("");
    const [showCompleted, changeCompleted] = useState([]);
    const [refresh,changeRefresh]=useState(false);

    useEffect(() => {
        fetch(`http://localhost:5000/gettasks?listname=${encodeURIComponent(listname)}&completed=${encodeURIComponent(false)}`)
            .then(res => res.json())
            .then(data => {
                //console.log(data)
                if(Array.isArray(data)){
                    changeList(data);
                }
                else{
                    changeList([]);
                }
            });

        fetch(`http://localhost:5000/gettasks?listname=${encodeURIComponent(listname)}&completed=${encodeURIComponent(true)}`)
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                if(Array.isArray(data)){
                    changeCompleted(data);
                }
                else{
                    changeList([]);
                }
                
            });
    }, [listname,refresh]);

    const onClickCheck = (index) => {
        fetch('http://localhost:5000/completed', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listname: listname, taskname: showList[index] })
        })
            .then(res => res.json())
            .then(data => {
                changeCompleted([...showCompleted, data]);
                changeList(showList.filter((_, val) => val != index));
            })
    }

    const onClickRemove = (index) => {
        fetch('http://localhost:5000/completedremove', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listname: listname, taskname: showCompleted[index] })
        })
            .then(res => res.json())
            .then(data => {
                changeList([...showList, data]);
                changeCompleted(showCompleted.filter((_, val) => val != index));
            })
    }

    const onDelete = (index) => {
        fetch('http://localhost:5000/delete', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listname: listname, taskname: showList[index] })
        })
            .then(res => res.text())
            .then(data => {
                console.log(data)
                changeList(showList.filter((_, val) => val != index));
                changeRefresh(prev=>!prev)
            })
    }

    const onDeleteCompleted = (index) => {
        console.log(showCompleted[index])
        fetch('http://localhost:5000/delete', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listname: listname, taskname: showCompleted[index] })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                changeCompleted(showCompleted.filter((_, val) => val != index));
                changeRefresh(prev=>!prev)
            })
    }

    const onChangeValue = (e) => {
        changeValue(e.target.value)
    }

    const onSubmitButton = (e) => {
        e.preventDefault();
        if (showvalue == "") {
            alert("Please specify a value")
            return
        }
        console.log({listname})
        console.log({showvalue})
        fetch('http://localhost:5000/addtask', {
            method: 'Post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listname:listname, task:showvalue })
        })
            .then(res => res.json())
            .then(data => {
                //console.log(data);
                  if (data.error) {
                    console.error(data.error);
                    alert(data.error); 
                    } else {
                        changeList([...showList, data]);
                        changeValue("");
                    }
                //navigate(`/list/${data.listname}`);
            })
        //changeList([...showList, showvalue])
        //changeValue("")
    }

    return (
        <>
            <div>
                <form onSubmit={onSubmitButton}>
                    <input type="Text" class="input" id="inputbox" onChange={onChangeValue} value={showvalue}></input>
                    <input type="submit" class="input" id="submit" value="ADD"></input>
                </form>
                <div class="listbox">
                    {showList.map((showValue, index) => (
                        <List
                            key={index}
                            value={showValue}
                            onClickCheck={() => onClickCheck(index)}
                            onDelete={() => onDelete(index)}
                        />
                    ))}
                    {showCompleted.length > 0 && <div id="completetitle">COMPLETED {'\u2705'}</div>}
                    {showCompleted.map((val, index) => (
                        <Completed
                            key={index}
                            value={val}
                            onClickRemove={() => onClickRemove(index)}
                            onDeleteCompleted={() => onDeleteCompleted(index)}
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